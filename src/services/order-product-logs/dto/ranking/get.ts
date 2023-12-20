import { IsNotEmpty, IsNumber } from 'class-validator';

export class OrderProductLogGetRankingQueryDto {
  @IsNotEmpty({ message: '랭킹 갯수는 필수입니다.' })
  @IsNumber({}, { message: '랭킹 갯수는 숫자여야합니다.' })
  limit!: number;
}
