import {
  Table,
  Column,
  Model,
  DataType,
  AutoIncrement,
  PrimaryKey,
  Sequelize,
} from 'sequelize-typescript';

@Table({ tableName: 'about_cover_images', timestamps: false })
export class CoverImage extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({ field: 'cover_image_1' })
  coverImage1: string;
  
  @Column({ field: 'cover_image_2' })
  coverImage2: string;
}
