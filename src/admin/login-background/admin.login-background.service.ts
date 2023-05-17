import { ASSET_TYPE, BUCKET_ACL_TYPE, BUCKET_NAME, HOME_DATA_TYPE, MESSAGE } from '@common/constants';
import { LoginBackground } from '@common/database/models/login-background.entity';
import { UploadToS3Service } from '@common/services/upload-s3.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class AdminLoginBackgroundService {
  private readonly bucketOption: any;

  constructor(
    @InjectModel(LoginBackground)
    private readonly lbModel: typeof LoginBackground,

    private uploadService: UploadToS3Service,
  ) {
    this.bucketOption = { 
      targetBucket: BUCKET_NAME.LB,
      bucketBase: process.env.AWS_S3_PUBLIC_BUCKET_NAME,
      acl: BUCKET_ACL_TYPE.PUBLIC_READ,
    };
  }
  
  async getLBData(): Promise<LoginBackground> {
    return await this.lbModel.findOne();
  }

  async update(
    data: Partial<LoginBackground>,
    files: Express.Multer.File[]
  ): Promise<LoginBackground> {
    const item = await this.lbModel.findOne();
    if (!item) {
      throw new HttpException(MESSAGE.FAILED_FETCH_LOGIN_BACKGROUND_DATA, HttpStatus.BAD_REQUEST);
    }

    if (data.type == ASSET_TYPE.IMAGE) {
      const backgroundImageFile: Express.Multer.File = files[0];
      const backgroundImageCompressedFile: Express.Multer.File = files[1];

      if (backgroundImageFile?.size) {
        data.backgroundImage = await this.uploadService.uploadFileToBucket(backgroundImageFile, ASSET_TYPE.IMAGE, false, this.bucketOption);
      }
  
      if (backgroundImageCompressedFile?.size) {
        data.backgroundImageCompressed = await this.uploadService.uploadFileToBucket(backgroundImageCompressedFile, ASSET_TYPE.IMAGE, false, this.bucketOption);
      }
    } else if (data.type == ASSET_TYPE.VIDEO) {
      const backgroundVideoFile: Express.Multer.File = files[0];
      const backgroundVideoCompressedFile: Express.Multer.File = files[1];
      
      if (backgroundVideoFile?.size) {
        data.backgroundVideo = await this.uploadService.uploadFileToBucket(backgroundVideoFile, ASSET_TYPE.VIDEO, false, this.bucketOption);
      }

      if (backgroundVideoCompressedFile?.size) {
        data.backgroundVideoCompressed = await this.uploadService.uploadFileToBucket(backgroundVideoCompressedFile, ASSET_TYPE.VIDEO, false, this.bucketOption);
      }
    }

    return await item.update(data);
  }
}
