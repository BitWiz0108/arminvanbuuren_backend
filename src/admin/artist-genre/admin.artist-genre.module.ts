import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ArtistGenre } from '@common/database/models/artist-genre.entity';
import { AdminArtistGenreService } from './admin.artist-genre.service';
import { AdminArtistGenreController } from './admin.artist-genre.controller';

@Module({
  imports: [SequelizeModule.forFeature([ArtistGenre])],
  providers: [ AdminArtistGenreService ],
  controllers: [ AdminArtistGenreController ],
})
export class AdminArtistGenreModule {}
