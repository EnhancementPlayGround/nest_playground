import { Body, Controller, Get, Patch, Query } from '@nestjs/common';
import { AccountService } from '../application';
import { AccountListQueryDto, AccountDepositBodyDto, AccountDto } from '../dto';

@Controller('/accounts')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Get('/')
  async list(@Query() query: AccountListQueryDto): Result<AccountDto[]> {
    const { userId } = query;
    const accounts = await this.accountService.list(userId);
    return { data: accounts };
  }

  @Patch('/')
  async deposit(@Body() body: AccountDepositBodyDto): Result<AccountDto> {
    const { userId, amount } = body;
    const account = await this.accountService.deposit({ userId, amount });
    return { data: account };
  }
}
