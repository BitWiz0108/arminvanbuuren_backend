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

@Table({ tableName: 'music_genres', timestamps: false })
export class MusicGenre extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  name: string
  
  @Column({ field: 'cover_image' })
  coverImage: string;

  @Column({ field: 'is_featured' })
  isFeatured: boolean;

  @Column({ field: 'is_trending' })
  isTrending: boolean;

  @Column({ field: 'is_recommended' })
  isRecommended: boolean;

  @Column
  status: boolean;
}
