import {
  Table,
  Column,
  Model,
  AutoIncrement,
  PrimaryKey,
  ForeignKey,
  BelongsToMany,
  BelongsTo,
  DataType,
} from 'sequelize-typescript';
import { User } from './user.entity';
import { LiveStream } from './live-stream.entity';

@Table({ tableName: 'live_stream_comments', })
export class LiveStreamComment extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => LiveStream)
  @Column({ field: 'live_stream_id' })
  livestreamId: string;
  
  @BelongsTo(() => LiveStream)
  livestream: LiveStream;

  @ForeignKey(() => User)
  @Column({ field: 'user_id' })
  userId: number;

  @BelongsTo(() => User)
  author: User;

  @Column
  content: string;

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