import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AboutService } from './about.service';
import { AboutController } from './about.controller';
import { CoverImage } from '@common/database/models/cover-images.entity';
import { SendEmailService } from '@common/services/send-email.service';
import { EmailTemplate } from '@common/database/models/email-template.entity';
import { User } from '@common/database/models/user.entity';

@Module({
  imports: [SequelizeModule.forFeature([CoverImage, EmailTemplate, User, ])],
  providers: [ AboutService, SendEmailService, ],
  controllers: [ AboutController ],
})

export class AboutModule {}
