import { Module } from '@nestjs/common';
import { AdminLoginBackgroundService } from './admin.login-background.service';
import { AdminLoginBackgroundController } from './admin.login-background.controller';
import { LoginBackground } from '@common/database/models/login-background.entity';
import { UploadToS3Service } from '@common/services/upload-s3.service';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([ LoginBackground ])],
  providers: [ AdminLoginBackgroundService, UploadToS3Service, ],
  controllers: [ AdminLoginBackgroundController ],
})

export class AdminLoginBackgroundModule {}
