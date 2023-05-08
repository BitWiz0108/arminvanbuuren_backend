import { Module, } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FanclubService } from './fanclub.service';
import { FanclubController } from './fanclub.controller';
import { User } from '@models/user.entity';
import { Album } from '@models/album.entity';
import { Music } from '@models/music.entity';
import { LiveStream } from '@models/live-stream.entity';
import { ArtistGenre } from '@common/database/models/artist-genre.entity';
import { Post } from '@models/post.entity';
import { Reply } from '@models/reply.entity';
import { PostLike } from '@models/post-like.entity';

@Module({
  imports: [SequelizeModule.forFeature([ User, Album, Music, LiveStream, ArtistGenre, Post, Reply, PostLike, ])],
  providers: [ FanclubService ],
  controllers: [ FanclubController ],
})
export class FanclubModule {}
