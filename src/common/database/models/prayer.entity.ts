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
import { User } from './user.entity';
import { PrayerRequest } from './prayer-request.entity';

@Table({ tableName: 'prayers', })
export class Prayer extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => User)
  @Column({ field: 'user_id' })
  userId: number;

  @BelongsTo(() => User)
  prayedUser: User;

  @ForeignKey(() => PrayerRequest)
  @Column({ field: 'prayer_request_id' })
  prayerRequestId: number;

  @BelongsTo(() => PrayerRequest)
  prayerRequest: PrayerRequest;
  
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
