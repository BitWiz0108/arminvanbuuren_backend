import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminPlaylistService } from './admin.playlist.service';
import { AdminPlaylistController } from './admin.playlist.controller';
import { UploadToS3Service } from '@common/services/upload-s3.service';
import { PlaylistMusic } from '@common/database/models/playlist-music.entity';
import { Playlist } from '@common/database/models/playlist.entity';

@Module({
  imports: [SequelizeModule.forFeature([ Playlist, PlaylistMusic ])],
  providers: [ AdminPlaylistService, UploadToS3Service ],
  controllers: [ AdminPlaylistController ],
})
export class AdminPlaylistModule {}
