import { IsNotEmpty, IsString } from 'class-validator';

export class ProductRetrieveParamDto {
  @IsNotEmpty({ message: '상품 id가 필요합니다.' })
  @IsString({ message: '상품 id는 문자열이어야 합니다.' })
  id!: string;
}
