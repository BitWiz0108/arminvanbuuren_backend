import { Controller, Param, Body, Get, Post, UseGuards, Put, Delete, Query, HttpCode, HttpStatus, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminTOSService } from './admin.tos.service';
import { AdminGuard } from '@admin/admin.guard';
import { TOS } from '@common/database/models/tos.entity';

@ApiBearerAuth()
@ApiTags('Admin Terms Of Service')
@UseGuards(AdminGuard)
@Controller(`${process.env.API_VERSION}/admin/termsofservice`)
export class AdminTOSController {
  constructor(private readonly tosService: AdminTOSService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getTOSContent() {
    return this.tosService.getTOSContent();
  }

  @Put()
  @HttpCode(HttpStatus.ACCEPTED)
  async update(
    @Body() payload: Partial<TOS>,
  ) {
    return await this.tosService.update(payload);
  }
}
