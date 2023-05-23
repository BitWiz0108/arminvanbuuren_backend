import {
  Table,
  Column,
  Model,
  DataType,
  AutoIncrement,
  PrimaryKey,
  Sequelize,
} from 'sequelize-typescript';

@Table({ tableName: 'login_background', timestamps: false, })
export class LoginBackground extends Model {
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

  @Column({ field: 'signin_description' })
  signInDescription: string;
}
