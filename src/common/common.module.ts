import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { config } from 'dotenv';
config();

import { AuthModule } from './modules/auth/auth.module';
import { SendEmailService } from './services/send-email.service';
import { EmailTemplate } from './database/models/email-template.entity';
import { UploadToS3Service } from './services/upload-s3.service';
import { User } from './database/models/user.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([ EmailTemplate, User, ]),
    AuthModule,
  ],
  controllers: [],
  providers: [
    SendEmailService,
    UploadToS3Service,
  ],
})
export class CommonModule {}
