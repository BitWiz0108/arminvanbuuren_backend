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
import { State } from './state.entity';

@Table({ tableName: 'cities', timestamps: false })
export class City extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  name: string;

  @ForeignKey(() => State)
  @Column({ field: 'state_id' })
  stateId: number;
  
  @BelongsTo(() => State)
  state: State

  @Column
  zipcode: string;
}
