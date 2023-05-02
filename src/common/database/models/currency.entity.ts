import {
  Table,
  Column,
  Model,
  DataType,
  AutoIncrement,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
  Sequelize,
  BelongsToMany,
} from 'sequelize-typescript';

@Table({ tableName: 'currencies', timestamps: false })
export class Currency extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  name: string;

  @Column
  code: string;

  @Column
  symbol: string;

  @Column
  format: string;

  @Column({ field: 'exchange_rate' })
  exchangeRate: number;

  @Column({ field: 'is_active' })
  isActive: boolean;

}
