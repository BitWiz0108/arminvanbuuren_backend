import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MusicService } from './music.service';
import { Music } from '@models/music.entity';
import { MusicController } from './music.controller';
import { User } from '@models/user.entity';
import { Favorite } from '@models/favorite.entity';
import { Language } from '@models/language.entity';
import { Album } from '@models/album.entity';
import { MusicGenre } from '@common/database/models/music-genre.entity';
import { AlbumMusic } from '@common/database/models/album-music.entity';

@Module({
  imports: [SequelizeModule.forFeature([Music, User, Favorite, Language, Album, MusicGenre, AlbumMusic, ])],
  providers: [ MusicService ],
  controllers: [ MusicController ],
})
export class MusicModule {}
