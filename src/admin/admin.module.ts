import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { SequelizeModule } from '@nestjs/sequelize';
import { config } from 'dotenv';
import { AdminGuard } from './admin.guard';
config();

import { AdminLiveStreamModule } from './live-stream/admin.live-stream.module';
import { AdminMusicModule } from './music/admin.music.module';
import { AdminArtistGenreModule } from './artist-genre/admin.artist-genre.module';
import { AdminMusicGenreModule } from './music-genre/admin.music-genre.module';
import { AdminLanguageModule } from './language/admin.language.module';
import { AdminAlbumModule } from './album/admin.album.module';
import { AdminPostModule } from './post/admin.post.module';
import { AdminArtistModule } from './artist/admin.artist.module';
import { AdminTransactionModule } from './transaction/admin.transaction.module';
import { AdminUserModule } from './user/admin.user.module';
import { AdminPlanModule } from './plan/admin.plan.module';
import { AdminCurrencyModule } from './currency/admin.currency.module';
import { AdminDashboardModule } from './dashboard/admin.dashboard.module';
import { AdminEmailTemplateModule } from './email-template/admin.email-template.module';
import { AdminTOSModule } from './tos/admin.tos.module';
import { AdminGalleryModule } from './gallery/admin.gallery.module';
import { AdminHomeModule } from './home/admin.home.module';
import { AdminAboutModule } from './about/admin.about.module';
import { AdminPaymentGatewayModule } from './payment-gateway/admin.payment-gateway.module';
import { AdminPrayerRequestModule } from './prayer-request/admin.prayer-request.module';
import { AdminLoginBackgroundModule } from './login-background/admin.login-background.module';
import { AdminCategoryModule } from './category/admin.category.module';
import { AdminOAuthModule } from './oauth/admin.oauth.module';

@Module({
  imports: [
    SequelizeModule.forFeature([]),
    AdminDashboardModule,
    AdminLiveStreamModule,
    AdminMusicModule,
    AdminArtistGenreModule,
    AdminMusicGenreModule,
    AdminLanguageModule,
    AdminAlbumModule,
    AdminPostModule,
    AdminArtistModule,
    AdminTransactionModule,
    AdminUserModule,
    AdminPlanModule,
    AdminCurrencyModule,
    AdminEmailTemplateModule,
    AdminTOSModule,
    AdminAboutModule,
    AdminGalleryModule,
    AdminHomeModule,
    AdminPaymentGatewayModule,
    AdminLoginBackgroundModule,
    AdminCategoryModule,
    AdminOAuthModule,
    AdminPrayerRequestModule,
  ],
  controllers: [],
  providers: [
  ],
})
export class AdminModule {}
