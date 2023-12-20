import { plainToClass } from 'class-transformer';
import { Product } from '../../../../src/services/products/domain/model';
import { badRequest } from '../../../../src/libs/exceptions';

describe('Product domain test', () => {
  describe('Ordered test', () => {
    const baseProduct = plainToClass(Product, {
      id: 'productId',
      name: 'productName',
      price: 1000,
      stock: 100,
    });

    test('상품이 주문되면 재고가 줄어든다.', () => {
      const product = plainToClass(Product, {
        ...baseProduct,
        stock: 150,
      });

      product.ordered({ quantity: 50 });

      expect(product.stock).toBe(100);
    });

    test('상품 주문 갯수가 재고보다 많으면 에러를 던진다.', () => {
      const product = plainToClass(Product, {
        ...baseProduct,
        stock: 150,
      });
      try {
        product.ordered({ quantity: 200 });
      } catch (err) {
        expect(err).toEqual(
          badRequest(`Can not order(quantity:200) this product(productId) more than stock(150)`, {
            errorMessage: '재고가 부족합니다.',
          }),
        );
      }
    });
  });
});
