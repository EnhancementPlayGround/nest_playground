import { Body, Controller, Get, Patch, Query } from '@nestjs/common';
import { validate } from 'class-validator';
import { AccountService } from '../application';
import { AccountListQueryDto, AccountDepositBodyDto, AccountDto } from '../dto';
import { validationError } from '../../../libs/exceptions';

@Controller('/accounts')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Get('/')
  async list(@Query() query: AccountListQueryDto): Result<AccountDto[]> {
    const { userId } = query;
    const accounts = await this.accountService.list(userId);
    const data = await Promise.all(
      accounts.map(async (account) => {
        const dto = new AccountDto(account);
        const [error] = await validate(dto);
        if (error) {
          throw validationError(`${error.property}: ${JSON.stringify(error.constraints)}`, {
            errorMessage: `${error.property}: ${JSON.stringify(error.constraints)}`,
          });
        }
        return dto;
      }),
    );

    return { data };
  }

  @Patch('/')
  async deposit(@Body() body: AccountDepositBodyDto): Result<AccountDto> {
    const { userId, amount } = body;
    const account = await this.accountService.deposit({ userId, amount });
    const data = new AccountDto(account);
    const [error] = await validate(data);
    if (error) {
      throw validationError(`${error.property}: ${JSON.stringify(error.constraints)}`, {
        errorMessage: `${error.property}: ${JSON.stringify(error.constraints)}`,
      });
    }
    return { data };
  }
}
