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
import { User } from './user.entity';
import { Music } from './music.entity';
import { PlaylistMusic } from './playlist-music.entity';

@Table({ tableName: 'playlists' })
export class Playlist extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  name: string

  @ForeignKey(() => User)
  @Column({ field: 'user_id' })
  userId: number;

  @BelongsTo(() => User)
  creator: User;

  @BelongsToMany(() => Music, () => PlaylistMusic)
  musics: Music[];

  get musicIds(): number[] {
    let musicIds= [];

    this.musics.map(music => {
      musicIds.push(music.id);
    });

    return musicIds;
  }

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
}
