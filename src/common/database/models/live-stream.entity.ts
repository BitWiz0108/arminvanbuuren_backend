import {
  Table,
  Column,
  Model,
  AutoIncrement,
  PrimaryKey,
  ForeignKey,
  BelongsToMany,
  BelongsTo,
  HasMany,
  DataType,
} from 'sequelize-typescript';
import { Favorite } from './favorite.entity';
import { User } from './user.entity';
import { Language } from './language.entity';
import { LiveStreamComment } from './live-stream-comment.entity';
import { Category } from './category.entity';

@Table({ tableName: 'live_streams', timestamps: false, }) // disable timestamps for this entity
export class LiveStream extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({ field: 'cover_image' })
  coverImage: string;
  
  @Column
  title: string;
  
  @ForeignKey(() => User)
  @Column({ field: 'user_id' })
  singerId: number;

  @BelongsTo(() => User)
  singer: User;
  
  @ForeignKey(() => User)
  @Column({ field: 'creator_id' })
  creatorId: number;

  @BelongsTo(() => User)
  creator: User;

  @ForeignKey(() => Category)
  @Column({ field: 'category_id' })
  categoryId: number;

  @BelongsTo(() => Category)
  category: Category

  @Column
  duration: number;
  
  @Column({ field: 'preview_video' })
  previewVideo: string;

  @Column({ field: 'preview_video_compressed' })
  previewVideoCompressed: string;

  @Column({ field: 'full_video' })
  fullVideo: string;

  @Column({ field: 'full_video_compressed' })
  fullVideoCompressed: string;

  @Column
  lyrics: string;

  @Column({ field: 'short_description' })
  shortDescription: string;
  
  @ForeignKey(() => Language)
  @Column({ field: 'language_id' })
  languageId: number;
  
  @BelongsTo(() => Language)
  language: Language;

  @Column
  description: string;

  @Column({ field: 'is_exclusive' })
  isExclusive: boolean;

  @Column({
    field: 'release_date',
  })
  releaseDate: string;

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

  @HasMany(() => Favorite)
  favorites: Favorite[];

  get likedBy(): number {
    return this.favorites.length;
  }
  
  @HasMany(() => LiveStreamComment)
  comments: LiveStreamComment[];
}