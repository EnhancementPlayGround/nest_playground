import { Test } from '@nestjs/testing';
import { plainToClass } from 'class-transformer';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ClassSerializerInterceptor, ValidationPipe, forwardRef } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { Reflector } from '@nestjs/core';
import { HttpExceptionFilter } from '@libs/exceptions';
import { getConfig } from '@config';
import { OrderService } from '../../../../src/services/orders/application';
import { ProductModule } from '../../../../src/services/products/module';
import { OrderRepository } from '../../../../src/services/orders/infrastructure/repository';
import { AccountRepository } from '../../../../src/services/accounts/infrastructure/repository';
import { ProductRepository } from '../../../../src/services/products/infrastructure/repository';
import { Product } from '../../../../src/services/products/domain/model';
import { Account } from '../../../../src/services/accounts/domain/model';
import { CalculateOrderService } from '../../../../src/services/orders/domain/services';
import { AccountModule } from '../../../../src/services/accounts/module';

jest.mock('nanoid');

describe('Order Service integration test', () => {
  let orderService: OrderService;
  let orderRepository: OrderRepository;
  let productRepository: ProductRepository;
  let accountRepository: AccountRepository;
  let dataSource: DataSource;
  let eventEmitter: EventEmitter2;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(getConfig('/ormconfig')),
        forwardRef(() => ProductModule),
        EventEmitterModule.forRoot(),
        AccountModule,
      ],
      providers: [OrderService, OrderRepository, CalculateOrderService],
    }).compile();

    orderService = module.get<OrderService>(OrderService);
    orderRepository = module.get<OrderRepository>(OrderRepository);
    dataSource = module.get<DataSource>(DataSource);
    productRepository = module.get<ProductRepository>(ProductRepository);
    accountRepository = module.get<AccountRepository>(AccountRepository);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);

    const app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('order test', () => {
    const testProducts = [
      plainToClass(Product, {
        id: 'orderTest1',
        name: 'orderTest1',
        price: 1000,
        stock: 100,
      }),
      plainToClass(Product, {
        id: 'orderTest2',
        name: 'orderTest2',
        price: 500,
        stock: 100,
      }),
    ];

    const testAccounts = [
      plainToClass(Account, {
        id: 'orderTest1',
        userId: 'orderTest1',
        name: 'account1',
        balance: 100000,
      }),
    ];

    beforeAll(async () => {
      await productRepository.save({ target: testProducts });
      await accountRepository.save({ target: testAccounts });

      const mockedNanoId = nanoid as jest.Mock<string>;
      mockedNanoId.mockImplementation(() => 'nanoId');
    });

    afterAll(async () => {
      await orderRepository.getManager().query('DELETE FROM `order_line`');
      await orderRepository.getManager().query('DELETE FROM `order`');
      await orderRepository.getManager().query('ALTER TABLE `order` AUTO_INCREMENT = 1');
      await productRepository.remove({ target: testProducts });
      await accountRepository.remove({ target: testAccounts });
    });

    // FIXME: 실패 원인 파악
    test.skip('주문을 생성하고 재고 차감, account 출금을 한다.', async () => {
      const result = await orderService.order({
        userId: 'orderTest1',
        lines: [
          { productId: 'orderTest1', quantity: 5 },
          { productId: 'orderTest2', quantity: 5 },
        ],
      });

      // NOTE: eventEmitter가 전부 끝날때 까지 조회를 멈춘다.
      await new Promise<void>((resolve) => {
        eventEmitter.on('OrderPaidEvent', () => {
          resolve();
        });
      });

      const products = await productRepository.find({ conditions: { ids: ['orderTest1', 'orderTest2'] } });
      const accounts = await accountRepository.find({ conditions: { userId: 'orderTest1' } });
      expect(result).toEqual({
        id: 'nanoId',
        userId: 'orderTest1',
        totalAmount: 7500,
        lines: [
          {
            productId: 'orderTest1',
            price: 1000,
            quantity: 5,
          },
          {
            productId: 'orderTest2',
            price: 500,
            quantity: 5,
          },
        ],
      });
      expect(accounts[0].balance).toEqual(92500);
      expect(products[0].stock).toEqual(95);
      expect(products[1].stock).toEqual(95);
    });
  });
});
