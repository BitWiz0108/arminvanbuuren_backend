import {
  Table,
  Column,
  Model,
  AutoIncrement,
  PrimaryKey,
  ForeignKey,
  BelongsToMany,
  BelongsTo,
  Sequelize,
  DataType,
} from 'sequelize-typescript';

@Table({ tableName: 'oauth', timestamps: false })
export class OAuth extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({
    field: 'provider',
    type: DataType.ENUM ('FACEBOOK', 'TWITTER', 'INSTAGRAM', 'AMAZON', 'GITHUB', 'LINKEDIN', 'YOUTUBE')
  })
  provider: 'FACEBOOK' | 'TWITTER' | 'INSTAGRAM' | 'AMAZON' | 'GITHUB' | 'LINKEDIN' | 'YOUTUBE';

  @Column({ field: 'app_id' })
  appId: string;

  @Column({ field: 'app_secret' })
  appSecret: string;
}