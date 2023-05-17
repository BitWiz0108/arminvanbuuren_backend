import { Controller, Param, Body, Get, Post, UseGuards, Put, Delete, Query, HttpCode, HttpStatus, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminGalleryService } from './admin.gallery.service';
import { AdminGuard } from '@admin/admin.guard';
import { Gallery } from '@models/gallery.entity';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@ApiBearerAuth()
@ApiTags('Admin Gallery')
@UseGuards(AdminGuard)
@Controller(`${process.env.API_VERSION}/admin/gallery`)
export class AdminGalleryController {
    constructor(private readonly galleryService: AdminGalleryService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll() {
      return this.galleryService.findAll();
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(FilesInterceptor('files'))
    async add(@Body() data: Partial<Gallery>, @UploadedFiles() files: Array<Express.Multer.File>) {
      const result = await this.galleryService.add(data, files);
      return result;
    }

    @Put()
    @HttpCode(HttpStatus.ACCEPTED)
    @UseInterceptors(FilesInterceptor('files'))
    async update(@Body() data: Partial<Gallery>, @UploadedFiles() files: Array<Express.Multer.File>) {
      const result = await this.galleryService.update(data, files);
      return result;
    }

    @Delete()
    @HttpCode(HttpStatus.ACCEPTED)
    async deleteItem(@Query('id') id: number) {
      await this.galleryService.remove(id);
    }
}
