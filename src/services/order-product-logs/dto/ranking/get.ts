import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';

export class OrderProductLogGetRankingQueryDto {
  @IsNotEmpty({ message: '랭킹 갯수는 필수입니다.' })
  @IsNumber({}, { message: '랭킹 갯수는 숫자여야합니다.' })
  @Type(() => Number)
  limit!: number;

  @IsNotEmpty({ message: '시작일은 필수입니다.' })
  @IsDate({ message: '시작일은 날짜여야합니다.' })
  @Type(() => Date)
  occurredAtStart!: Date;

  @IsNotEmpty({ message: '종료일은 필수입니다.' })
  @IsDate({ message: '종료일은 날짜여야합니다.' })
  @Type(() => Date)
  occurredAtEnd!: Date;
}
