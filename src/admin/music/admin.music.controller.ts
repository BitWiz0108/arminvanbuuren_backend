import { Controller, Param, Body, Get, Post, UseGuards, Put, Delete, Query, HttpCode, HttpStatus, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@common-modules/auth/role.enum';
import { Roles } from '@common-modules/auth/roles.decorator';
import { AdminMusicService } from './admin.music.service';
import { MusicOption } from './dto/music-option';
import { Music } from '@models/music.entity';
import { AdminGuard } from '@admin/admin.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@ApiBearerAuth()
@ApiTags('Admin Music')
@UseGuards(AdminGuard)
@Controller(`${process.env.API_VERSION}/admin/music`)
export class AdminMusicController {
    constructor(private readonly musicService: AdminMusicService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(@Query('page') page: number, @Query('limit') limit: number) {
      return this.musicService.findAll({page, limit});
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(FilesInterceptor('files'))
    async add(
      @Body() data: Partial<Music>, 
      @UploadedFiles() files: Array<Express.Multer.File>,
    ) {
      const result = await this.musicService.add(data, files);
      return result;
    }

    @Put()
    @HttpCode(HttpStatus.ACCEPTED)
    @UseInterceptors(FilesInterceptor('files'))
    async update(
      @Body() data: Partial<Music>,
      @UploadedFiles() files: Array<Express.Multer.File>,
    ) {
      const album = await this.musicService.update(data, files);
      return album;
    }

    @Delete()
    @HttpCode(HttpStatus.ACCEPTED)
    async deleteItem(@Query('id') id: number) {
      await this.musicService.remove(id);
    }
}
