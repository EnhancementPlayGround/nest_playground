import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsString, Min, ValidateNested } from 'class-validator';

class LineDto {
  @IsNotEmpty({ message: '상품 id가 필요합니다.' })
  @IsString({ message: '상품 id는 문자열이어야 합니다.' })
  productId!: string;

  @IsNotEmpty({ message: '구매 수량이 필요합니다.' })
  @IsNumber({}, { message: '구매 수량은 숫자여야 합니다.' })
  @Min(1, { message: '구매 수량은 최소 1개여야 합니다.' })
  quantity!: number;
}

export class OrderBodyDto {
  @IsNotEmpty({ message: 'userId가 필요합니다.' })
  @IsString({ message: 'userId는 문자열이어야 합니다.' })
  userId!: string;

  @Type(() => LineDto)
  @ValidateNested({ each: true })
  @IsArray({ message: '구매 상품이 필요합니다.' })
  @ArrayMinSize(1, { message: '구매 상품이 필요합니다.' })
  lines!: LineDto[];
}
