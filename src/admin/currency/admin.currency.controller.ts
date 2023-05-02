import { Controller, Param, Body, Get, Post, UseGuards, Put, Delete, Query, HttpCode, HttpStatus, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminCurrencyService } from './admin.currency.service';
import { AdminGuard } from '@admin/admin.guard';
import { Currency } from '@common/database/models/currency.entity';

@ApiBearerAuth()
@ApiTags('Admin Currency')
@UseGuards(AdminGuard)
@Controller(`${process.env.API_VERSION}/admin/currency`)
export class AdminCurrencyController {
  constructor(private readonly currencyService: AdminCurrencyService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return this.currencyService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async add(
    @Body() data: Partial<Currency>
  ) {
    return this.currencyService.add(data);
  }

  @Put()
  @HttpCode(HttpStatus.ACCEPTED)
  async update(
    @Body() data: Partial<Currency>
  ) {
    return this.currencyService.update(data);
  }

  @Delete()
  @HttpCode(HttpStatus.ACCEPTED)
  async deleteUser(@Query('id') id: number) {
    await this.currencyService.remove(id);
  }
}
