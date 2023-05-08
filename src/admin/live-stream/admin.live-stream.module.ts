import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminLiveStreamService } from './admin.live-stream.service';
import { LiveStream } from '@models/live-stream.entity';
import { AdminLiveStreamController } from './admin.live-stream.controller';
import { User } from '@models/user.entity';
import { Language } from '@models/language.entity';
import { Favorite } from '@models/favorite.entity';
import { UploadToS3Service } from '@common/services/upload-s3.service';
import { LiveStreamComment } from '@common/database/models/live-stream-comment.entity';

@Module({
  imports: [SequelizeModule.forFeature([LiveStream, User, Favorite, Language, LiveStreamComment])],
  providers: [ AdminLiveStreamService, UploadToS3Service ],
  controllers: [ AdminLiveStreamController ],
})
export class AdminLiveStreamModule {}
