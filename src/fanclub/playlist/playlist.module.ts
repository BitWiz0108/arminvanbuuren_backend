import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PlaylistService } from './playlist.service';
import { PlaylistController } from './playlist.controller';
import { UploadToS3Service } from '@common/services/upload-s3.service';
import { PlaylistMusic } from '@common/database/models/playlist-music.entity';
import { Playlist } from '@common/database/models/playlist.entity';

@Module({
  imports: [SequelizeModule.forFeature([ Playlist, PlaylistMusic ])],
  providers: [ PlaylistService, UploadToS3Service ],
  controllers: [ PlaylistController ],
})
export class PlaylistModule {}
