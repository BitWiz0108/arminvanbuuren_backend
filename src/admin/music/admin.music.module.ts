import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminMusicService } from './admin.music.service';
import { Music } from '@models/music.entity';
import { AdminMusicController } from './admin.music.controller';
import { User } from '@models/user.entity';
import { Language } from '@models/language.entity';
import { Favorite } from '@models/favorite.entity';
import { Album } from '@models/album.entity';
import { MusicGenre } from '@common/database/models/music-genre.entity';
import { UploadToS3Service } from '@common/services/upload-s3.service';

@Module({
  imports: [SequelizeModule.forFeature([Music, User, Language, Favorite, Album, MusicGenre, ])],
  providers: [ AdminMusicService, UploadToS3Service, ],
  controllers: [ AdminMusicController ],
})
export class AdminMusicModule {}
