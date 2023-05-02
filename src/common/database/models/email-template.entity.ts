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

@Table({ tableName: 'email_templates', timestamps: false })
export class EmailTemplate extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({ field: 'logo_image' })
  logoImage: string;

  @Column({
    field: 'type',
    type: DataType.ENUM('THANK', 'EMAIL_VERIFICATION', 'PASSWORD_RESET'),
  })
  type: 'THANK' | 'EMAIL_VERIFICATION' | 'PASSWORD_RESET';

  @Column({
    field: 'from_name'
  })
  fromName: string;

  @Column({
    field: 'from_email'
  })
  fromEmail: string;

  @Column
  subject: string;

  @Column
  html: string;

  @Column
  title: string;

  @Column
  content: string;
}
