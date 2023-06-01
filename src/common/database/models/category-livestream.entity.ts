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
import { LiveStream } from './live-stream.entity';
import { Category } from './category.entity';

@Table({ tableName: 'category_livestream', timestamps: false })
export class CategoryLivestream extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Category)
  @Column({ field: 'category_id' })
  categoryId: number;

  @ForeignKey(() => LiveStream)
  @Column({ field: 'livestream_id' })
  livestreamId: number;
}
