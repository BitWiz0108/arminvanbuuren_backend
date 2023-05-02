import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminMusicGenreService } from './admin.music-genre.service';
import { AdminMusicGenreController } from './admin.music-genre.controller';
import { MusicGenre } from '@common/database/models/music-genre.entity';

@Module({
  imports: [SequelizeModule.forFeature([ MusicGenre ])],
  providers: [ AdminMusicGenreService ],
  controllers: [ AdminMusicGenreController ],
})
export class AdminMusicGenreModule {}
