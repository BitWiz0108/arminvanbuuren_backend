import {
    Table,
    Column,
    Model,
    AutoIncrement,
    PrimaryKey,
    ForeignKey,
    BelongsToMany,
    BelongsTo,
  } from 'sequelize-typescript';
  
  @Table({ tableName: 'roles', timestamps: false })
  export class Role extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;
  
    @Column
    name: string;
  }