import {
  Table,
  Column,
  Model,
  DataType,
  AutoIncrement,
  PrimaryKey,
  Sequelize,
} from 'sequelize-typescript';

@Table({ tableName: 'home', timestamps: false, })
export class Home extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({
    field: 'type',
    type: DataType.ENUM('IMAGE', 'VIDEO'),
  })
  type: 'IMAGE' | 'VIDEO';

  @Column({ field: 'background_image' })
  backgroundImage: string;

  @Column({ field: 'background_image_compressed' })
  backgroundImageCompressed: string;

  @Column({ field: 'background_video' })
  backgroundVideo: string;

  @Column({ field: 'background_video_compressed' })
  backgroundVideoCompressed: string;

  @Column({ field: 'youtube_video_url' })
  youtubeVideoUrl: string;

  @Column({ field: 'youtube_title' })
  youtubeTitle: string;

  @Column({ field: 'signin_description' })
  signInDescription: string;

  @Column({ field: 'homepage_description' })
  homePageDescription: string;
}
