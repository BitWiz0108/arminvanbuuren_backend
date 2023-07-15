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

  @Column({
    field: 'order_id',
  })
  orderId: number;
  
  @Column({
    field: 'type',
    type: DataType.ENUM('IMAGE', 'VIDEO'),
  })
  type: 'IMAGE' | 'VIDEO';
  
  @Column
  image: string;

  @Column({ field: 'image_compressed'})
  imageCompressed: string;

  @Column
  video: string;

  @Column({ field: 'video_compressed' })
  videoCompressed: string;

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
