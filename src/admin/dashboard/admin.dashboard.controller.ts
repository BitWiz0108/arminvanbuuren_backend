import { Controller, Param, Body, Get, Post, UseGuards, Put, Delete, Query, HttpCode, HttpStatus, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminDashboardService } from './admin.dashboard.service';
import { AdminGuard } from '@admin/admin.guard';
import { BestSellingInputDto } from './dto/dashboard-input.dto';

@ApiBearerAuth()
@ApiTags('Admin Dashboard')
@UseGuards(AdminGuard)
@Controller(`${process.env.API_VERSION}/admin/dashboard`)
export class AdminDashboardController {
  constructor(private readonly dashboardService: AdminDashboardService) {}

  @Get('statistics')
  @HttpCode(HttpStatus.OK)
  async getStatistics() {
    return this.dashboardService.getStatistics();
  }

  @Post('best-sellings')
  @HttpCode(HttpStatus.OK)
  async getBestSelling(
    @Body() payload: BestSellingInputDto
  ) {
    return this.dashboardService.getBestSelling(payload);
  }
}
