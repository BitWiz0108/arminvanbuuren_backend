import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminDashboardService } from './admin.dashboard.service';
import { AdminDashboardController } from './admin.dashboard.controller';
import { User } from '@common/database/models/user.entity';
import { Music } from '@common/database/models/music.entity';
import { LiveStream } from '@common/database/models/live-stream.entity';
import { Album } from '@common/database/models/album.entity';
import { Plan } from '@common/database/models/plan.entity';
import { Transaction } from '@common/database/models/transaction.entity';

@Module({
  imports: [SequelizeModule.forFeature([ User, Music, LiveStream, Album, Plan, Transaction,  ])],
  providers: [ AdminDashboardService ],
  controllers: [ AdminDashboardController ],
})
export class AdminDashboardModule {}
