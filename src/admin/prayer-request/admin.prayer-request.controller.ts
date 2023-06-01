import { Controller, Param, Body, Get, Post, UseGuards, Put, Delete, Query, HttpCode, HttpStatus, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminPrayerRequestService } from './admin.prayer-request.service';
import { AdminGuard } from '@admin/admin.guard';
import { PrayerRequestApprovePayloadDto, PrayerRequestPayloadDto } from './dto/prayer-request-option.dto';
import { PrayerRequest } from '@common/database/models/prayer-request.entity';

@ApiBearerAuth()
@ApiTags('Admin Prayer Request')
@UseGuards(AdminGuard)
@Controller(`${process.env.API_VERSION}/admin/prayer-request`)
export class AdminPrayerRequestController {
  constructor(private readonly prayerService: AdminPrayerRequestService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('page') page: number, @Query('limit') limit: number
  ) {
    return this.prayerService.findAll({ page, limit });
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async add(
    @Body() data: PrayerRequestPayloadDto,
  ) {
    return this.prayerService.add(data);
  }

  @Put()
  @HttpCode(HttpStatus.ACCEPTED)
  async update(
    @Body() data: Partial<PrayerRequest>,
  ) {
    const pr = await this.prayerService.update(data);
    return pr;
  }

  @Delete()
  @HttpCode(HttpStatus.ACCEPTED)
  async deleteItem(@Query('id') id: number) {
    await this.prayerService.remove(id);
  }

  @Delete('delete-replies')
  @HttpCode(HttpStatus.ACCEPTED)
  async deleteReplies(@Body() data: any) {
    await this.prayerService.removeReplies(data);
  }

  @Post('approve')
  @HttpCode(HttpStatus.ACCEPTED)
  async approve(
    @Body() data: PrayerRequestApprovePayloadDto,
  ) {
    await this.prayerService.approve(data);
  }
}
