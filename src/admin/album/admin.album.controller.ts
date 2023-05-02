import { Controller, Param, Body, Get, Post, UseGuards, Put, Delete, Query, HttpCode, HttpStatus, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminAlbumService } from './admin.album.service';
import { AdminGuard } from '@admin/admin.guard';
import { Album } from '@models/album.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiBearerAuth()
@ApiTags('Admin Album')
@UseGuards(AdminGuard)
@Controller(`${process.env.API_VERSION}/admin/album`)
export class AdminAlbumController {
    constructor(private readonly albumService: AdminAlbumService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll() {
      return this.albumService.findAll();
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(FileInterceptor('imageFile'))
    async add(@Body() data: Partial<Album>, @UploadedFile() imageFile: Express.Multer.File) {
      const result = await this.albumService.add(data, imageFile);
      return result;
    }

    @Put()
    @HttpCode(HttpStatus.ACCEPTED)
    @UseInterceptors(FileInterceptor('imageFile'))
    async update(
      @Body() data: Partial<Album>,
      @UploadedFile() file: Express.Multer.File,
    ) {
      const album = await this.albumService.update(data, file);
      return album;
    }

    @Delete()
    @HttpCode(HttpStatus.ACCEPTED)
    async deleteItem(@Query('id') id: number) {
      await this.albumService.remove(id);
    }
}
