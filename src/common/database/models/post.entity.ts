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
import { User } from './user.entity';
import { Reply } from './reply.entity';
import { PostLike } from './post-like.entity';

@Table({ tableName: 'posts', })
export class Post extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  image: string

  @Column({ field: 'compressed_image' })
  compressedImage: string

  @ForeignKey(() => User)
  @Column({ field: 'user_id' })
  authorId: number;

  @BelongsTo(() => User)
  author: User;

  @Column
  title: string;

  @Column
  content: string;
  
  @HasMany(() => Reply)
  replies: Reply[];

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

  @HasMany(() => PostLike)
  likes: PostLike[];

  get likedBy(): number {
    return this.likes.length;
  }
}
