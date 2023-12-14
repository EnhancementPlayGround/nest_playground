import { Module } from '@nestjs/common';
import { AccountController } from './presentation/controller';
import { AccountService } from './application';
import { AccountRepository } from './infrastructure/repository';

@Module({
  controllers: [AccountController],
  providers: [AccountService, AccountRepository],
})
export class AccountModule {}
