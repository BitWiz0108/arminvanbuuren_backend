import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminTransactionService } from './admin.transaction.service';
import { AdminTransactionController } from './admin.transaction.controller';
import { Transaction } from '@common/database/models/transaction.entity';
import { EmailTemplate } from '@common/database/models/email-template.entity';

@Module({
  imports: [SequelizeModule.forFeature([ Transaction, EmailTemplate ])],
  providers: [ AdminTransactionService ],
  controllers: [ AdminTransactionController ],
})
export class AdminTransactionModule {}
