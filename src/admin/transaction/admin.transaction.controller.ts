import { Controller, Param, Body, Get, Post, UseGuards, Put, Delete, Query, HttpCode, HttpStatus, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminTransactionService } from './admin.transaction.service';
import { AdminGuard } from '@admin/admin.guard';

@ApiBearerAuth()
@ApiTags('Admin Transaction')
@UseGuards(AdminGuard)
@Controller(`${process.env.API_VERSION}/admin/transactions`)
export class AdminTransactionController {
  constructor(private readonly transService: AdminTransactionService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('page') page: number, @Query('limit') limit: number
  ) {
    return this.transService.findAll({ page, limit });
  }
}
