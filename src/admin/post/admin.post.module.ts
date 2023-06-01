import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminPostService } from './admin.post.service';
import { AdminPostController } from './admin.post.controller';
import { Post } from '@models/post.entity';
import { UploadToS3Service } from '@common/services/upload-s3.service';
import { Reply } from '@common/database/models/reply.entity';
import { PostFile } from '@common/database/models/post-files.entity';

@Module({
  imports: [SequelizeModule.forFeature([ Post, Reply, PostFile, ])],
  providers: [ AdminPostService, UploadToS3Service ],
  controllers: [ AdminPostController ],
})
export class AdminPostModule {}
