import { IsNotEmpty, IsString } from 'class-validator';

export class AccountListQueryDto {
  @IsNotEmpty({ message: 'userId가 필요합니다.' })
  @IsString({ message: 'userId는 문자열이어야 합니다.' })
  userId!: string;
}

// ReponseDto는 왜 없는가?
