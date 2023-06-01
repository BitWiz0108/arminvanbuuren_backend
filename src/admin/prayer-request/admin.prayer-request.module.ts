import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminPrayerRequestService } from './admin.prayer-request.service';
import { AdminPrayerRequestController } from './admin.prayer-request.controller';
import { PrayerRequest } from '@common/database/models/prayer-request.entity';
import { PrayerReply } from '@common/database/models/prayer-reply.entity';

@Module({
  imports: [SequelizeModule.forFeature([ PrayerRequest, PrayerReply, ])],
  providers: [ AdminPrayerRequestService, ],
  controllers: [ AdminPrayerRequestController ],
})
export class AdminPrayerRequestModule {}
