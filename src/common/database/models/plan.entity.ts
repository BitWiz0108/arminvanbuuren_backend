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
import { Currency } from './currency.entity';

@Table({ tableName: 'plans', })
export class Plan extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({ field: 'image' })
  coverImage: string;

  @Column
  name: string;

  @Column
  price: number;

  @ForeignKey(() => Currency)
  @Column({ field: 'currency_id' })
  currencyId: number;

  @BelongsTo(() => Currency)
  currency: Currency;

  @Column
  description: string;

  @Column
  duration: number;
  
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