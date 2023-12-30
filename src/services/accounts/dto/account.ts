import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AccountDto {
  @IsNotEmpty({ message: '계좌번호가 필요합니다.' })
  @IsString({ message: '계좌번호는 문자열이어야 합니다.' })
  id!: string;

  @IsNotEmpty({ message: 'userId가 필요합니다.' })
  @IsString({ message: 'userId는 문자열이어야 합니다.' })
  userId!: string;

  @IsNotEmpty({ message: '잔액이 필요합니다.' })
  @IsNumber({}, { message: '잔액은 숫자여야 합니다.' })
  balance!: number;

  constructor(args: { id: string; userId: string; balance: number }) {
    if (args) {
      this.id = args.id;
      this.userId = args.userId;
      this.balance = args.balance;
    }
  }

  static of(args: { id: string; userId: string; balance: number }) {
    return new AccountDto(args);
  }
}
