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

  @Column
  description: string;

  @Column({
    field: 'size',
    type: DataType.ENUM('SQUARE', 'WIDE', 'TALL', 'WIDEANDTALL'),
  })
  size: 'SQUARE' | 'WIDE' | 'TALL' | 'WIDEANDTALL';

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
