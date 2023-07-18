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
import { Music } from './music.entity';
import { Playlist } from './playlist.entity';

@Table({ tableName: 'playlist_music', timestamps: false })
export class PlaylistMusic extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Playlist)
  @Column({ field: 'playlist_id' })
  playlistId: number;

  @ForeignKey(() => Music)
  @Column({ field: 'music_id' })
  musicId: number;
}
