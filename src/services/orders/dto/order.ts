import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsString, Min, ValidateNested } from 'class-validator';

class LineDto {
  @IsNotEmpty({ message: '상품 id가 필요합니다.' })
  @IsString({ message: '상품 id는 문자열이어야 합니다.' })
  productId!: string;

  @IsNotEmpty({ message: '가격이 필요합니다.' })
  @IsNumber({}, { message: '가격은 숫자여야 합니다.' })
  price!: number;

  @IsNotEmpty({ message: '구매 수량이 필요합니다.' })
  @IsNumber({}, { message: '구매 수량은 숫자여야 합니다.' })
  @Min(1, { message: '구매 수량은 최소 1개여야 합니다.' })
  quantity!: number;

  constructor(args: { productId: string; price: number; quantity: number }) {
    if (args) {
      this.productId = args.productId;
      this.price = args.price;
      this.quantity = args.quantity;
    }
  }
}

export class OrderDto {
  @IsNotEmpty({ message: '계좌번호가 필요합니다.' })
  @IsString({ message: '계좌번호는 문자열이어야 합니다.' })
  id!: string;

  @IsNotEmpty({ message: 'userId가 필요합니다.' })
  @IsString({ message: 'userId는 문자열이어야 합니다.' })
  userId!: string;

  @IsNotEmpty({ message: '총 주문금액이 필요합니다.' })
  @IsNumber({}, { message: '총 주문금액은 숫자여야 합니다.' })
  totalAmount!: number;

  @Type(() => LineDto)
  @ValidateNested({ each: true })
  @IsArray({ message: '구매 상품이 필요합니다.' })
  @ArrayMinSize(1, { message: '구매 상품이 필요합니다.' })
  lines!: LineDto[];

  constructor(args: { id: string; userId: string; totalAmount: number; lines: LineDto[] }) {
    if (args) {
      this.id = args.id;
      this.userId = args.userId;
      this.totalAmount = args.totalAmount;
      this.lines = args.lines.map((line) => new LineDto(line));
    }
  }

  static of(args: { id: string; userId: string; totalAmount: number; lines: LineDto[] }) {
    return new OrderDto(args);
  }
}
