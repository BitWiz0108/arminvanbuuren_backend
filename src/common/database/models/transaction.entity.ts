import {
  Table,
  Column,
  Model,
  AutoIncrement,
  PrimaryKey,
  ForeignKey,
  BelongsToMany,
  BelongsTo,
  Sequelize,
  DataType,
} from 'sequelize-typescript';
import { User } from './user.entity';
import { Plan } from './plan.entity';
import { Currency } from './currency.entity';
import { LiveStream } from './live-stream.entity';
import { Music } from './music.entity';

@Table({ tableName: 'transactions', })
export class Transaction extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({
    field: 'type',
    type: DataType.ENUM('SUBSCRIPTION', 'DONATION'),
  })
  type: 'SUBSCRIPTION' | 'DONATION';

  @ForeignKey(() => User)
  @Column({ field: 'user_id' })
  userId: number;

  @BelongsTo(() => User)
  buyer: User;

  assetType: 'LIVESTREAM' | 'MUSIC';

  @ForeignKey(() => LiveStream)
  @Column({ field: 'livestream_id' })
  livestreamId: number;

  @BelongsTo(() => LiveStream)
  livestream: LiveStream;

  @ForeignKey(() => Music)
  @Column({ field: 'music_id' })
  musicId: number;

  @BelongsTo(() => Music)
  music: Music;

  @ForeignKey(() => Plan)
  @Column({ field: 'plan_id' })
  planId: number;

  @BelongsTo(() => Plan)
  plan: Plan;

  @Column({ 
    field: 'provider',
    type: DataType.ENUM('PAYPAL', 'STRIPE'),
  })
  provider: 'PAYPAL' | 'STRIPE';

  @Column
  amount: number;
  
  @ForeignKey(() => Currency)
  @Column({ field: 'currency_id' })
  currencyId: number;

  @BelongsTo(() => Currency)
  currency: Currency;

  @Column({ field: 'order_id' })
  orderId: string;

  @Column({
    field: 'status',
    type: DataType.ENUM('SUCCEEDED', 'PENDING', 'FAILED'),
  })
  status: 'SUCCEEDED' | 'PENDING' | 'FAILED';

  @Column({
    field: 'created_at',
    type: DataType.DATE,
  })
  createdAt: Date;

  @Column({
    field: 'updated_at',
    type: DataType.DATE,
  })
  updatedAt: Date;
}