import { Controller, Param, Body, Get, Post, HttpCode, HttpStatus, UseInterceptors, UploadedFile, Query, Put, UploadedFiles } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminLoginBackgroundService } from './admin.login-background.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Home } from '@common/database/models/home.entity';

@ApiBearerAuth()
@ApiTags('Admin Login Background Management')
@Controller(`${process.env.API_VERSION}/admin/login-background`)
export class AdminLoginBackgroundController {
  constructor(private readonly adminLBService: AdminLoginBackgroundService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getLBData() {
    return this.adminLBService.getLBData();
  }

  @Put()
  @HttpCode(HttpStatus.ACCEPTED)
  @UseInterceptors(FilesInterceptor('files'))
  async update(
    @Body() data: Partial<Home>,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const updateHomeData = await this.adminLBService.update(
      data,
      files,
    );
    return updateHomeData;
  }
}
