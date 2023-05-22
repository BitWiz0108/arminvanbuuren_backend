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
import { Music } from './music.entity';

@Table({ tableName: 'albums' })
export class Album extends Model {
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
  
  @Column({ field: 'release_date' })
  releaseDate: string;
  
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

  @HasMany(() => Music)
  musics: Music[]

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
