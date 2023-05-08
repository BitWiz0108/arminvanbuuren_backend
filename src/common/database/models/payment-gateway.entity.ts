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

@Table({ tableName: 'payment_gateways', timestamps: false })
export class PaymentGateway extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  paypalClientId: string;

  @Column
  paypalClientSecret: string;

  @Column
  stripePublicApiKey: string;

  @Column
  stripeSecretKey: string;
}