import {
  Table,
  Column,
  Model,
  AutoIncrement,
  PrimaryKey,
  ForeignKey,
  BelongsToMany,
  BelongsTo,
  Sequelize,
  DataType,
  HasMany,
} from 'sequelize-typescript';
import { Favorite } from './favorite.entity';
import { User } from './user.entity';
import { Album } from './album.entity';
import { Language } from './language.entity';
import { MusicGenre } from './music-genre.entity';
import { AlbumMusic } from './album-music.entity';

@Table({ tableName: 'musics', })
export class Music extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({ field: 'cover_image' })
  coverImage: string;

  @Column({ field: 'music_file' })
  musicFile: string;

  @Column({ field: 'music_file_compressed' })
  musicFileCompressed: string;

  @Column({ field: 'video_background' })
  videoBackground: string;

  @Column({ field: 'video_background_compressed' })
  videoBackgroundCompressed: string;

  @Column({ field: 'download_price' })
  downloadPrice: number;

  // albumIds: number[];

  get albumIds(): number[] {
    let albumIds = [];

    this.albums.map(album => {
      albumIds.push(album.id);
    });

    return albumIds;
  }

  @Column
  duration: number;

  @Column
  title: string;

  @ForeignKey(() => MusicGenre)
  @Column({ field: 'music_genre_id' })
  musicGenreId: number;

  @BelongsTo(() => MusicGenre)
  musicGenre: MusicGenre

  @ForeignKey(() => User)
  @Column({ field: 'user_id' })
  userId: number;

  @BelongsTo(() => User)
  singer: User

  @ForeignKey(() => Language)
  @Column({ field: 'language_id' })
  languageId: number;

  @BelongsTo(() => Language)
  language: Language;

  @Column
  copyright: string;

  @Column({ field: 'listening_count' })
  listeningCount: number;

  @Column({ field: 'is_featured' })
  isFeatured: boolean;

  @Column({ field: 'is_trending' })
  isTrending: boolean;

  @Column({ field: 'is_recommended' })
  isRecommended: boolean;

  @Column
  status: boolean;

  @Column
  lyrics: string;

  @Column
  description: string;
  
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
  
  @Column({ field: 'is_exclusive' })
  isExclusive: boolean;

  @BelongsToMany(() => Album, () => AlbumMusic)
  albums: Album[];

  @HasMany(() => Favorite)
  favorites: Favorite[];

  get likedBy(): number {
    return this.favorites.length;
  }
}