import { Controller, Param, Body, Get, Post, UseGuards, Put, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminMusicGenreService } from './admin.music-genre.service';
import { AdminGuard } from '@admin/admin.guard';
import { MusicGenre } from '@common/database/models/music-genre.entity';

@ApiBearerAuth()
@ApiTags('Admin Music Genre')
@UseGuards(AdminGuard)
@Controller(`${process.env.API_VERSION}/admin/music/genres`)
export class AdminMusicGenreController {
    constructor(private readonly musicGenreService: AdminMusicGenreService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll() {
      return this.musicGenreService.findAll();
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async add(@Body() data: MusicGenre) {
      return this.musicGenreService.add(data);
    }

    @Put()
    @HttpCode(HttpStatus.ACCEPTED)
    async update(
      @Body() data: Partial<MusicGenre>,
    ) {
      const music_genre = await this.musicGenreService.update(
        data.id,
        data,
      );
      return music_genre;
    }

    @Delete()
    @HttpCode(HttpStatus.ACCEPTED)
    async deleteItem(@Query('id') id: number) {
      await this.musicGenreService.remove(id);
    }
}
