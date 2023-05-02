import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminCurrencyService } from './admin.currency.service';
import { AdminCurrencyController } from './admin.currency.controller';
import { Currency } from '@common/database/models/currency.entity';

@Module({
  imports: [SequelizeModule.forFeature([ Currency ])],
  providers: [ AdminCurrencyService ],
  controllers: [ AdminCurrencyController ],
})
export class AdminCurrencyModule {}
