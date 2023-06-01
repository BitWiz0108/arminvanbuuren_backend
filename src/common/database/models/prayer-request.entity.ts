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
import { PrayerReply } from './prayer-reply.entity';
import { Prayer } from './prayer.entity';

@Table({ tableName: 'prayer_requests', })
export class PrayerRequest extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => User)
  @Column({ field: 'user_id' })
  authorId: number;

  @BelongsTo(() => User)
  author: User;

  @Column
  title: string;

  @Column
  content: string;
  
  @Column({field: 'is_anonymous'})
  isAnonymous: boolean;

  @Column({field: 'is_approved'})
  isApproved: boolean;

  @HasMany(() => PrayerReply)
  replies: PrayerReply[];

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

  @HasMany(() => Prayer)
  prayers: Prayer[];

  get prayedBy(): number {
    return this.prayers.length;
  }
}
