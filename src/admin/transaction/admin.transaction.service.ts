import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from '@common/database/models/transaction.entity';
import { AdminTransactionPaginatedDto } from './dto/transaction.dto';
import { TransactionViewOption } from './dto/transaction-option-dto';
import { User } from '@common/database/models/user.entity';
import { LiveStream } from '@common/database/models/live-stream.entity';
import { Music } from '@common/database/models/music.entity';
import { Plan } from '@common/database/models/plan.entity';
import { Currency } from '@common/database/models/currency.entity';
import { EmailTemplate } from '@common/database/models/email-template.entity';

@Injectable()
export class AdminTransactionService {

  constructor(
    @InjectModel(Transaction)
    private readonly transModel: typeof Transaction,
    @InjectModel(EmailTemplate)
    private readonly emailModel: typeof EmailTemplate,
  ) {}

  async findAll(op: TransactionViewOption): Promise<AdminTransactionPaginatedDto> {
    const limit = Number(op.limit); // ensure limit is a number
    const page = Number(op.page);
    const transactions: Transaction[] = await this.transModel.findAll({ 
      offset: (page - 1) * limit, 
      limit: limit,
      include: [
        { model: User, as: 'buyer' },
        { model: LiveStream, as: 'livestream', },
        { model: Music, as: 'music', },
        { model: Plan, as: 'plan', },
        { model: Currency, as: 'currency', },
      ]
    });

    const totalItems = await this.transModel.count();
    const pages: number = Math.ceil(totalItems / limit);

    const data : AdminTransactionPaginatedDto = {
      pages: pages,
      transactions: transactions,
    };
    return data;
  }
}
