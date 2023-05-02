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

@Table({ tableName: 'languages', timestamps: false })
export class Language extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  name: string;

  @Column
  code: string;

  @Column({ field: 'is_default' })
  isDefault: boolean;

  @Column
  status: boolean;

}
