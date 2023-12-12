import { Controller, Get, Query } from '@nestjs/common';
import { AccountService } from '../application';
import { AccountListQueryDto } from '../dto';

@Controller('/accounts')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Get('/')
  async list(@Query() query: AccountListQueryDto) {
    const { userId } = query;
    return this.accountService.list(userId);
  }
}
