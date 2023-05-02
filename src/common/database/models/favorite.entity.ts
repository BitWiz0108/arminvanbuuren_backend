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
import { LiveStream } from './live-stream.entity';
import { Music } from './music.entity';
import { User } from './user.entity';

@Table({ tableName: 'favorites', timestamps: false })
export class Favorite extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => User)
  @Column({ field: 'user_id' })
  userId: number;

  @ForeignKey(() => Music)
  @Column({ field: 'music_id' })
  musicId: number;

  @ForeignKey(() => LiveStream)
  @Column({ field: 'live_stream_id' })
  livestreamId: number;
}
