import {
  Table,
  Column,
  Model,
  DataType,
  AutoIncrement,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';

@Table({ tableName: 'tos', timestamps: false })
export class TOS extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  content: string;
}
