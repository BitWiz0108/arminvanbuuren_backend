import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { config } from 'dotenv';
config();

import { LiveStreamModule } from './live-stream/live-stream.module';
import { MusicModule } from './music/music.module';
import { FanclubModule } from './fanclub/fanclub.module';
import { ProfileModule } from './profile/profile.module';
import { FinanceModule } from './finance/finance.module';
import { TOSModule } from './terms-of-service/tos.module';
import { AboutModule } from './about/about.module';
import { GalleryModule } from './gallery/gallery.module';
import { HomeModule } from './home/home.module';
import { PrayerRequestModule } from './prayer-request/prayer-request.module';
import { PlaylistModule } from './playlist/playlist.module';

@Module({
  imports: [
    LiveStreamModule,
    MusicModule,
    FanclubModule,
    ProfileModule,
    FinanceModule,
    TOSModule,
    AboutModule,
    GalleryModule,
    HomeModule,
    PrayerRequestModule,
    PlaylistModule,
  ],
  controllers: [],
  providers: [],
})
export class FanPanelModule {}
