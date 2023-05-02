import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LiveStreamService } from './live-stream.service';
import { LiveStream } from '@models/live-stream.entity';
import { LiveStreamController } from './live-stream.controller';
import { User } from '@models/user.entity';
import { Favorite } from '@models/favorite.entity';
import { Language } from '@models/language.entity';
import { LiveStreamComment } from '@common/database/models/live-stream-comment.entity';

@Module({
  imports: [SequelizeModule.forFeature([LiveStream, User, Favorite, Language, LiveStreamComment, ])],
  providers: [ LiveStreamService ],
  controllers: [ LiveStreamController ],
})
export class LiveStreamModule {}
