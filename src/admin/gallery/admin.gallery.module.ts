import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminGalleryService } from './admin.gallery.service';
import { AdminGalleryController } from './admin.gallery.controller';
import { Gallery } from '@models/gallery.entity';
import { UploadToS3Service } from '@common/services/upload-s3.service';

@Module({
  imports: [SequelizeModule.forFeature([ Gallery ])],
  providers: [ AdminGalleryService, UploadToS3Service ],
  controllers: [ AdminGalleryController ],
})
export class AdminGalleryModule {}
