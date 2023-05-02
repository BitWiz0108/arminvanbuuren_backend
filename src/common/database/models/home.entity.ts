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

  @Column({ field: 'background_video' })
  backgroundVideo: string;

  @Column({ field: 'youtube_video_url' })
  youtubeVideoUrl: string;

  @Column({ field: 'youtube_title' })
  youtubeTitle: string;
}
