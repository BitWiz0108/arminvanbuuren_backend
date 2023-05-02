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
import { Country } from './country.entity';
import { City } from './city.entity';

@Table({ tableName: 'states', timestamps: false })
export class State extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  name: string;

  @ForeignKey(() => Country)
  @Column({ field: 'country_id'})
  countryId: number;
  
  @BelongsTo(() => Country)
  country: Country

  @HasMany(() => City)
  cities: City[];
}
