import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class AccountDepositBodyDto {
  @IsNotEmpty({ message: 'userId가 필요합니다.' })
  @IsString({ message: 'userId는 문자열이어야 합니다.' })
  userId!: string;

  @IsNotEmpty({ message: '충전 금액이 필요합니다.' })
  @IsNumber({}, { message: '충전 금액은 숫자여야 합니다.' })
  @Min(1, { message: '충전 금액은 1원 이상이어야 합니다.' })
  amount!: number;
}
