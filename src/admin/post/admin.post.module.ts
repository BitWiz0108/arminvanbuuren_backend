import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminPostService } from './admin.post.service';
import { AdminPostController } from './admin.post.controller';
import { Post } from '@models/post.entity';
import { UploadToS3Service } from '@common/services/upload-s3.service';

@Module({
  imports: [SequelizeModule.forFeature([ Post ])],
  providers: [ AdminPostService, UploadToS3Service ],
  controllers: [ AdminPostController ],
})
export class AdminPostModule {}
