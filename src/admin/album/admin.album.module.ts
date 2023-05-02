import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminAlbumService } from './admin.album.service';
import { AdminAlbumController } from './admin.album.controller';
import { Album } from '@models/album.entity';
import { UploadToS3Service } from '@common/services/upload-s3.service';

@Module({
  imports: [SequelizeModule.forFeature([ Album ])],
  providers: [ AdminAlbumService, UploadToS3Service ],
  controllers: [ AdminAlbumController ],
})
export class AdminAlbumModule {}
