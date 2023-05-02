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
import { User } from './user.entity';
import { Post } from './post.entity';

@Table({ tableName: 'replies', })
export class Reply extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => User)
  @Column({ field: 'user_id' })
  replierId: number;

  @BelongsTo(() => User)
  replier: User;

  @ForeignKey(() => Post)
  @Column({ field: 'post_id' })
  postId: number;

  @BelongsTo(() => Post)
  post: Post;

  @Column
  content: string;

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
