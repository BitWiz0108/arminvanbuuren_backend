import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FinanceService } from './finance.service';
import { FinanceController } from './finance.controller';
import { Plan } from '@common/database/models/plan.entity';
import { Currency } from '@common/database/models/currency.entity';
import { Transaction } from '@common/database/models/transaction.entity';
import { ConfigService } from '@nestjs/config';
import { User } from '@common/database/models/user.entity';
import { SendEmailService } from '@common/services/send-email.service';
import { EmailTemplate } from '@common/database/models/email-template.entity';

@Module({
  imports: [SequelizeModule.forFeature([ Transaction, Plan, Currency, User, EmailTemplate, ])],
  providers: [ FinanceService, ConfigService, SendEmailService ],
  controllers: [ FinanceController ],
})
export class FinanceModule {}
