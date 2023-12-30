import { Body, Controller, Get, Patch, Query } from '@nestjs/common';
import { validate } from 'class-validator';
import { validationError } from '@libs/exceptions';
import { AccountService } from '../application';
import { AccountListQueryDto, AccountDepositBodyDto, AccountDto } from '../dto';

@Controller('/accounts')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Get('/')
  async list(@Query() query: AccountListQueryDto): Result<AccountDto[]> {
    // Destructure
    const { userId } = query;

    // Call application service
    const data = await this.accountService.getList(userId);

    // Validate output
    const [error] = await validate(data);
    if (error) {
      throw validationError(`${error.property}: ${JSON.stringify(error.constraints)}`, {
        errorMessage: `${error.property}: ${JSON.stringify(error.constraints)}`,
      });
    }

    // Return result
    return { data };
  }

  @Patch('/')
  async deposit(@Body() body: AccountDepositBodyDto): Result<AccountDto> {
    // Destructure
    const { userId, amount } = body;

    // Call application service
    const data = await this.accountService.deposit({ userId, amount });

    // Validate output
    const [error] = await validate(data);
    if (error) {
      throw validationError(`${error.property}: ${JSON.stringify(error.constraints)}`, {
        errorMessage: `${error.property}: ${JSON.stringify(error.constraints)}`,
      });
    }

    // Return result
    return { data };
  }
}
