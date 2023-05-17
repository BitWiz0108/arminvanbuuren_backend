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
import { LiveStream } from './live-stream.entity';

@Table({ tableName: 'categories' })
export class Category extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  image: string

  @Column
  name: string

  @ForeignKey(() => User)
  @Column({ field: 'user_id' })
  userId: number;

  @BelongsTo(() => User)
  creator: User;

  @Column
  description: string;

  @Column
  copyright: string;
  
  @Column({ field: 'is_featured' })
  isFeatured: boolean;

  @Column({ field: 'is_trending' })
  isTrending: boolean;

  @Column({ field: 'is_recommended' })
  isRecommended: boolean;

  @Column({ field: 'is_verified' })
  isVerified: boolean;

  @Column
  status: boolean;

  @HasMany(() => LiveStream)
  livestreams: LiveStream[]

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
