import { Controller, Param, Body, Get, Post, UseGuards, Put, Delete, Query, HttpCode, HttpStatus, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminAlbumService } from './admin.album.service';
import { AdminGuard } from '@admin/admin.guard';
import { Album } from '@models/album.entity';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@ApiBearerAuth()
@ApiTags('Admin Album')
@UseGuards(AdminGuard)
@Controller(`${process.env.API_VERSION}/admin/album`)
export class AdminAlbumController {
    constructor(private readonly albumService: AdminAlbumService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(
      @Query('searchKey') searchKey: string
    ) {
      return this.albumService.findAll({ searchKey });
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(FilesInterceptor('files'))
    async add(@Body() data: Partial<Album>, @UploadedFiles() files: Array<Express.Multer.File>,) {
      const result = await this.albumService.add(data, files);
      return result;
    }

    @Put()
    @HttpCode(HttpStatus.ACCEPTED)
    @UseInterceptors(FilesInterceptor('files'))
    async update(
      @Body() data: Partial<Album>,
      @UploadedFiles() files: Array<Express.Multer.File>,
    ) {
      const album = await this.albumService.update(data, files);
      return album;
    }

    @Delete()
    @HttpCode(HttpStatus.ACCEPTED)
    async deleteItem(@Query('id') id: number) {
      await this.albumService.remove(id);
    }
}
