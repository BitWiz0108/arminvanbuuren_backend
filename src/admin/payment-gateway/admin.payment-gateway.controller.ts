import { Controller, Param, Body, Get, Post, UseGuards, Put, Delete, Query, HttpCode, HttpStatus, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminPaymentGatewayService } from './admin.payment-gateway.service';
import { AdminGuard } from '@admin/admin.guard';
import { PaymentGateway } from '@common/database/models/payment-gateway.entity';

@ApiBearerAuth()
@ApiTags('Admin Payment Gateway')
@UseGuards(AdminGuard)
@Controller(`${process.env.API_VERSION}/admin/payment-gateways`)
export class AdminPaymentGatewayController {
  constructor(private readonly pgService: AdminPaymentGatewayService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getPaymentGateways() {
    return this.pgService.getPaymentGateways();
  }

  @Put()
  @HttpCode(HttpStatus.ACCEPTED)
  async update(
    @Body() data: Partial<PaymentGateway>,
  ) {
    const pg = await this.pgService.update(data);
    return pg;
  }
}
