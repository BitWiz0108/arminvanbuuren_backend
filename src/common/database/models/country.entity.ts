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
  HasMany,
} from 'sequelize-typescript';
import { State } from './state.entity';

@Table({ tableName: 'countries', timestamps: false })
export class Country extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  name: string;
  
  @Column
  code: string;

  @Column
  iso: string;

  @Column
  iso3: string;

  @Column
  numcode: string;

  @Column
  phonecode: string;

  @HasMany(() => State)
  states: State[];
}
