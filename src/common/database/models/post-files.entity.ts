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
import { Post } from './post.entity';

@Table({ tableName: 'post_files', })
export class PostFile extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Post)
  @Column({ field: 'post_id' })
  postId: number;

  @BelongsTo(() => Post)
  post: Post;
  
  @Column({
    field: 'type',
    type: DataType.ENUM ('VIDEO', 'IMAGE')
  })
  type: 'VIDEO' | 'IMAGE';

  @Column
  file: string;

  @Column({ field: 'file_compressed' })
  fileCompressed: string;

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
