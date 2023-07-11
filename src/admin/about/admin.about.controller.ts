import { Controller, Param, Body, Get, Post, UseGuards, Put, Delete, Query, HttpCode, HttpStatus, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminAboutService } from './admin.about.service';
import { AdminGuard } from '@admin/admin.guard';
import { CoverImage } from '@common/database/models/cover-images.entity';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiBearerAuth()
@ApiTags('Admin About')
@UseGuards(AdminGuard)
@Controller(`${process.env.API_VERSION}/admin/about`)
export class AdminAboutController {
  constructor(private readonly aboutService: AdminAboutService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAboutData() {
    return this.aboutService.getAboutData();
  }

  @Put('images')
  @HttpCode(HttpStatus.ACCEPTED)
  @UseInterceptors(FilesInterceptor('files'))
  async update(
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return await this.aboutService.update(files);
  }

  @Put('connect')
  @HttpCode(HttpStatus.ACCEPTED)
  async updateAboutText(
    @Body() data: any,
  ) {
    return await this.aboutService.updateAboutText(data);
  }
}
