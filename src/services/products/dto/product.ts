import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProductDto {
  @IsNotEmpty({ message: '계좌번호가 필요합니다.' })
  @IsString({ message: '계좌번호는 문자열이어야 합니다.' })
  id!: string;

  @IsNotEmpty({ message: '상품명이 필요합니다.' })
  @IsString({ message: '상품명은 문자열이어야 합니다.' })
  name!: string;

  @IsNotEmpty({ message: '가격이 필요합니다.' })
  @IsNumber({}, { message: '가격은 숫자여야 합니다.' })
  price!: number;

  @IsNotEmpty({ message: '재고가 필요합니다.' })
  @IsNumber({}, { message: '재고는 숫자여야 합니다.' })
  stock!: number;

  constructor(args: ProductDto) {
    if (args) {
      this.id = args.id;
      this.name = args.name;
      this.price = args.price;
      this.stock = args.stock;
    }
  }
}
