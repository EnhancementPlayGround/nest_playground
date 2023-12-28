import { Body, Controller, Get, Patch, Query } from '@nestjs/common';
import { validate } from 'class-validator';
import { AccountService } from '../application';
import { AccountListQueryDto, AccountDepositBodyDto, AccountDto } from '../dto';
import { validationError } from '../../../libs/exceptions'; // 절대경로 필요

@Controller('/accounts')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Get()
  async list(@Query() query: AccountListQueryDto): Result<AccountDto[]> {
    // Destructure
    const { userId } = query;

    // Call application service
    // 네이밍이 직관적이지 않다. .list 는 뭔가.. 뭔가...뭔가임
    const data = await this.accountService.list(userId);

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
