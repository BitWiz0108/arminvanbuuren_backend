import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminUserService } from './admin.user.service';
import { AdminUserController } from './admin.user.controller';
import { User } from '@common/database/models/user.entity';
import { UploadToS3Service } from '@common/services/upload-s3.service';

@Module({
  imports: [SequelizeModule.forFeature([ User ])],
  providers: [ AdminUserService, UploadToS3Service ],
  controllers: [ AdminUserController ],
})
export class AdminUserModule {}
