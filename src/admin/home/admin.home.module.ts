import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminHomeService } from './admin.home.service';
import { AdminHomeController } from './admin.home.controller';
import { Home } from '@common/database/models/home.entity';
import { UploadToS3Service } from '@common/services/upload-s3.service';

@Module({
  imports: [SequelizeModule.forFeature([ Home ])],
  providers: [ AdminHomeService, UploadToS3Service, ],
  controllers: [ AdminHomeController ],
})

export class AdminHomeModule {}
