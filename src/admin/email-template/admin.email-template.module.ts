import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminEmailTemplateService } from './admin.email-template.service';
import { AdminEmailTemplateController } from './admin.email-template.controller';
import { EmailTemplate } from '@common/database/models/email-template.entity';
import { UploadToS3Service } from '@common/services/upload-s3.service';

@Module({
  imports: [SequelizeModule.forFeature([ EmailTemplate ])],
  providers: [ AdminEmailTemplateService, UploadToS3Service ],
  controllers: [ AdminEmailTemplateController ],
})
export class AdminEmailTemplateModule {}
