import {
  Table,
  Column,
  Model,
  DataType,
  AutoIncrement,
  PrimaryKey,
  Sequelize,
} from 'sequelize-typescript';

@Table({ tableName: 'gallery', })
export class Gallery extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  image: string;

  @Column({ field: 'compressed_image'})
  compressedImage: string;

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
