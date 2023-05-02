import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminAboutService } from './admin.about.service';
import { AdminAboutController } from './admin.about.controller';
import { CoverImage } from '@common/database/models/cover-images.entity';
import { UploadToS3Service } from '@common/services/upload-s3.service';

@Module({
  imports: [SequelizeModule.forFeature([ CoverImage ])],
  providers: [ AdminAboutService, UploadToS3Service, ],
  controllers: [ AdminAboutController ],
})
export class AdminAboutModule {}
