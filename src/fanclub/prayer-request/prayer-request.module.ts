import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PrayerRequestService } from './prayer-request.service';
import { PrayerRequestController } from './prayer-request.controller';
import { PrayerRequest } from '@common/database/models/prayer-request.entity';
import { PrayerReply } from '@common/database/models/prayer-reply.entity';
import { Prayer } from '@common/database/models/prayer.entity';

@Module({
  imports: [SequelizeModule.forFeature([ PrayerRequest, PrayerReply, Prayer, ])],
  providers: [ PrayerRequestService, ],
  controllers: [ PrayerRequestController ],
})
export class PrayerRequestModule {}
