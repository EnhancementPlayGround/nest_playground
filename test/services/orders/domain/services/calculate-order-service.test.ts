import { plainToClass } from 'class-transformer';
import { CalculateOrderService } from '../../../../../src/services/orders/domain/services';
import { Product } from '../../../../../src/services/products/domain/model';

describe('CalculateOrderService', () => {
  const calculateOrderService = new CalculateOrderService();
  describe('calculate test', () => {
    test('주문의 총 금액을 계산하여 반환한다.', () => {
      const products = [
        plainToClass(Product, {
          id: 'productId1',
          name: '상품1',
          price: 500,
          stock: 50,
        }),
        plainToClass(Product, {
          id: 'productId2',
          name: '상품2',
          price: 1000,
          stock: 50,
        }),
        plainToClass(Product, {
          id: 'productId3',
          name: '상품3',
          price: 1500,
          stock: 50,
        }),
      ];
      const result = calculateOrderService.calculate({
        orderLines: [
          { productId: 'productId1', quantity: 20 },
          { productId: 'productId2', quantity: 20 },
          { productId: 'productId3', quantity: 20 },
        ],
        products,
      });

      expect(result).toEqual({
        totalAmount: 500 * 20 + 1000 * 20 + 1500 * 20,
        lines: [
          { productId: 'productId1', price: 500, quantity: 20 },
          { productId: 'productId2', price: 1000, quantity: 20 },
          { productId: 'productId3', price: 1500, quantity: 20 },
        ],
      });
    });
  });
});
