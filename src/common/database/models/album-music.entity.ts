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
import { Album } from './album.entity';

@Table({ tableName: 'album_music', timestamps: false })
export class AlbumMusic extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Album)
  @Column({ field: 'album_id' })
  albumId: number;

  @ForeignKey(() => Music)
  @Column({ field: 'music_id' })
  musicId: number;
}
