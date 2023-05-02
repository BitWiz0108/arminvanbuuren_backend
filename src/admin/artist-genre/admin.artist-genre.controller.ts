import { Controller, Param, Body, Get, Post, UseGuards, Put, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminArtistGenreService } from './admin.artist-genre.service';
import { AdminGuard } from '@admin/admin.guard';
import { ArtistGenre } from '@common/database/models/artist-genre.entity';

@ApiBearerAuth()
@ApiTags('Admin Artist Genre')
@UseGuards(AdminGuard)
@Controller(`${process.env.API_VERSION}/admin/artist/genres`)
export class AdminArtistGenreController {
    constructor(private readonly artistGenreService: AdminArtistGenreService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll() {
      return this.artistGenreService.findAll();
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async add(@Body() data: ArtistGenre) {
      return this.artistGenreService.add(data);
    }

    @Put()
    @HttpCode(HttpStatus.ACCEPTED)
    async update(
      @Body() data: Partial<ArtistGenre>,
    ) {
      const artist_genre = await this.artistGenreService.update(
        data.id,
        data,
      );
      return artist_genre;
    }

    @Delete()
    @HttpCode(HttpStatus.ACCEPTED)
    async deleteItem(@Query('id') id: number) {
      await this.artistGenreService.remove(id);
    }
}
