import { Body, Controller, Get, Patch, Query } from '@nestjs/common';
import { AccountService } from '../application';
import { AccountListQueryDto, AccountDepositBodyDto } from '../dto';

@Controller('/accounts')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Get('/')
  async list(@Query() query: AccountListQueryDto) {
    const { userId } = query;
    return this.accountService.list(userId);
  }

  @Patch('/')
  async deposit(@Body() body: AccountDepositBodyDto) {
    const { userId, amount } = body;
    return this.accountService.deposit({ userId, amount });
  }
}
