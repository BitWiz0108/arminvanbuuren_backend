import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { EmailTemplate } from '@common/database/models/email-template.entity';
import { UploadToS3Service } from '@common/services/upload-s3.service';
import { ASSET_TYPE, BUCKET_ACL_TYPE, BUCKET_NAME, EMAIL_TEMPLATE_TYPE, MESSAGE } from '@common/constants';

@Injectable()
export class AdminEmailTemplateService {
  private readonly bucketOption: any;

  constructor(
    @InjectModel(EmailTemplate)
    private readonly emailModel: typeof EmailTemplate,

    private uploadService: UploadToS3Service,
  ) {
    this.bucketOption = {
      targetBucket: BUCKET_NAME.LOGO,
      bucketBase: process.env.AWS_S3_PUBLIC_BUCKET_NAME,
      acl: BUCKET_ACL_TYPE.PUBLIC_READ,
    };
  }

  async getEmailTemplate(type: EMAIL_TEMPLATE_TYPE): Promise<EmailTemplate> {
    const item = await this.emailModel.findOne({
      where: { type }
    });
    return item;
  }

  async updateEmailTemplate(
    data: Partial<EmailTemplate>,
    file: Express.Multer.File
  ): Promise<EmailTemplate> {
    const item = await this.emailModel.findByPk(data.id);
    if (!item) {
      throw new HttpException(MESSAGE.FAILED_LOAD_ITEM, HttpStatus.BAD_REQUEST);
    }
    
    if (file) {
      data.logoImage = await this.uploadService.uploadFileToBucket(file, ASSET_TYPE.IMAGE, true, this.bucketOption);
    }
    
    await item.update(data);

    return await this.emailModel.findByPk(data.id);
  }
}
