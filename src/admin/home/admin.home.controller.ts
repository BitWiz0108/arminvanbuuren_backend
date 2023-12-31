import { Controller, Param, Body, Get, Post, HttpCode, HttpStatus, UseInterceptors, UploadedFile, Query, Put, UploadedFiles } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminHomeService } from './admin.home.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Home } from '@common/database/models/home.entity';

@ApiBearerAuth()
@ApiTags('Admin Home Data Management')
@Controller(`${process.env.API_VERSION}/admin/home`)
export class AdminHomeController {
  constructor(private readonly adminHomeService: AdminHomeService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getHomeData() {
    return this.adminHomeService.getHomeData();
  }

  @Put()
  @HttpCode(HttpStatus.ACCEPTED)
  @UseInterceptors(FilesInterceptor('files'))
  async update(
    @Body() data: Partial<Home>,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const updateHomeData = await this.adminHomeService.update(
      data,
      files,
    );
    return updateHomeData;
  }
}
