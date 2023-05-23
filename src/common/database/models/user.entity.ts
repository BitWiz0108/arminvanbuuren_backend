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
import { Favorite } from './favorite.entity';
import { LiveStream } from './live-stream.entity';
import { Music } from './music.entity';
import { Role } from './role.entity';
import { Album } from './album.entity';
import { ArtistGenre } from './artist-genre.entity';
import { Plan } from './plan.entity';
import { Post } from './post.entity';

@Table({ tableName: 'users' })
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  username: string;

  @Column({ field: 'first_name' })
  firstName: string;

  @Column({ field: 'last_name' })
  lastName: string;

  @Column
  email: string;
  
  @Column
  password: string;

  @Column({ field: 'email_verified_at' })
  emailVerifiedAt: string;

  @ForeignKey(() => Role)
  @Column({ field: 'role_id' })
  roleId: number;

  @BelongsTo(() => Role)
  role: Role;

  @Column({ field: 'facebook_id' })
  facebookId: number;

  @Column({
    field: 'artist_verify_status',
    type: DataType.ENUM('PENDING', 'DECLINED', 'APPROVED'),
  })
  artistVerifyStatus: 'PENDING' | 'DECLINED' | 'APPROVED';

  @ForeignKey(() => ArtistGenre)
  @Column({ field: 'artist_genre_id' })
  artistGenreId: number;

  @Column({ field: 'artist_name' })
  artistName: string;

  @BelongsTo(() => ArtistGenre)
  genre: ArtistGenre;

  @Column({ field: 'accept_term_and_policy' })
  acceptTermAndPolicy: boolean;

  @Column({ field: 'avatar_image' })
  avatarImage: string;

  @Column({ field: 'logo_image' })
  logoImage: string;

  @Column({
    field: 'banner_type',
    type: DataType.ENUM ('VIDEO', 'IMAGE')
  })
  bannerType: 'VIDEO' | 'IMAGE';
  
  @Column({ field: 'banner_image' })
  bannerImage: string;

  @Column({ field: 'banner_image_compressed' })
  bannerImageCompressed: string;

  @Column({ field: 'banner_video' })
  bannerVideo: string;

  @Column({ field: 'banner_video_compressed' })
  bannerVideoCompressed: string;

  @Column
  mobile: string;

  @Column
  description: string;

  @Column
  website: string;
  
  @Column({ field: 'facebook_url' })
  facebook: string;

  @Column({ field: 'instagram_url' })
  instagram: string;

  @Column({ field: 'youtube_url' })
  youtube: string;

  @Column({ field: 'twitter_url' })
  twitter: string;

  @Column({ field: 'soundcloud_url' })
  soundcloud: string;

  @Column({
    field: 'gender',
    type: DataType.ENUM ('FEMAIL', 'MALE')
  })
  gender: 'FEMAIL' | 'MALE';
  
  @ForeignKey(() => Plan)
  @Column({ field: 'plan_id' })
  planId: number;

  @BelongsTo(() => Plan)
  plan: Plan;
  
  @Column({ field: 'plan_start_date' })
  planStartDate: string;
  
  @Column({ field: 'plan_end_date' })
  planEndDate: string;

  @Column({ field: 'date_of_birth' })
  dob: string;
  
  @Column
  status: boolean;
  
  @Column
  address: string;

  @Column
  country: string;

  @Column
  state: string;

  @Column
  city: string;

  @Column
  zipcode: string;

  @Column({ field: 'is_featured' })
  isFeatured: boolean;

  @Column({ field: 'is_trending' })
  isTrending: boolean;

  @Column({ field: 'is_recommended' })
  isRecommended: boolean;

  @Column({ field: 'remember_token' })
  rememberToken: string;

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

  @BelongsToMany(() => Music, () => Favorite)
  favoriteMusics: Music[]

  @BelongsToMany(() => LiveStream, () => Favorite)
  favoriteVideos: LiveStream[]

  @HasMany(() => Music)
  musics: Music[]

  @HasMany(() => LiveStream)
  livestreams: LiveStream[]

  @HasMany(() => Album)
  albums: Album[]

  @HasMany(() => Post)
  posts: Post[]
}
