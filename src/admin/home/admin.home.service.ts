import { ASSET_TYPE, BUCKET_ACL_TYPE, BUCKET_NAME, HOME_DATA_TYPE, MESSAGE } from '@common/constants';
import { Home } from '@common/database/models/home.entity';
import { UploadToS3Service } from '@common/services/upload-s3.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class AdminHomeService {
  private readonly bucketOption: any;

  constructor(
    @InjectModel(Home)
    private readonly homeModel: typeof Home,

    private uploadService: UploadToS3Service,
  ) {
    this.bucketOption = { 
      targetBucket: BUCKET_NAME.HOME,
      bucketBase: process.env.AWS_S3_PUBLIC_BUCKET_NAME,
      acl: BUCKET_ACL_TYPE.PUBLIC_READ,
    };
  }
  
  async getHomeData(): Promise<Home> {
    return await this.homeModel.findOne();
  }

  async update(
    data: Partial<Home>,
    files: Express.Multer.File[]
  ): Promise<Home> {
    const item = await this.homeModel.findOne();
    if (!item) {
      throw new HttpException(MESSAGE.FAILED_FETCH_HOME_DATA, HttpStatus.BAD_REQUEST);
    }

    const backgroundImageFile: Express.Multer.File = data.type == HOME_DATA_TYPE.IMAGE ? files[0] : null;
    const backgroundImageCompressedFile: Express.Multer.File = data.type == HOME_DATA_TYPE.IMAGE ? files[1] : null;

    const backgroundVideoFile: Express.Multer.File = data.type == HOME_DATA_TYPE.VIDEO ? files[0] : null;
    const backgroundVideoCompressedFile: Express.Multer.File = data.type == HOME_DATA_TYPE.VIDEO ? files[1] : null;

    const signInBackgroundVideoFile: Express.Multer.File = data.type == HOME_DATA_TYPE.VIDEO ? files[2] : null;
    const signInBackgroundVideoCompressedFile: Express.Multer.File = data.type == HOME_DATA_TYPE.VIDEO ? files[3] : null;

    const signInBackgroundImageFile: Express.Multer.File = data.type == HOME_DATA_TYPE.IMAGE ? files[2] : null;
    const signInBackgroundImageCompressedFile: Express.Multer.File = data.type == HOME_DATA_TYPE.IMAGE ? files[3] : null;

    if (backgroundImageFile?.size) {
      data.backgroundImage = await this.uploadService.uploadFileToBucket(backgroundImageFile, ASSET_TYPE.IMAGE, false, this.bucketOption);
    }

    if (backgroundImageCompressedFile?.size) {
      data.backgroundImageCompressed = await this.uploadService.uploadFileToBucket(backgroundImageCompressedFile, ASSET_TYPE.IMAGE, false, this.bucketOption);
    }

    if (backgroundVideoFile?.size) {
      data.backgroundVideo = await this.uploadService.uploadFileToBucket(backgroundVideoFile, ASSET_TYPE.VIDEO, false, this.bucketOption);
    }

    if (backgroundVideoCompressedFile?.size) {
      data.backgroundVideoCompressed = await this.uploadService.uploadFileToBucket(backgroundVideoCompressedFile, ASSET_TYPE.VIDEO, false, this.bucketOption);
    }

    if (signInBackgroundVideoFile?.size) {
      data.signInBackgroundVideo = await this.uploadService.uploadFileToBucket(signInBackgroundVideoFile, ASSET_TYPE.VIDEO, false, this.bucketOption);
    }

    if (signInBackgroundVideoCompressedFile?.size) {
      data.signInBackgroundVideoCompressed = await this.uploadService.uploadFileToBucket(signInBackgroundVideoCompressedFile, ASSET_TYPE.VIDEO, false, this.bucketOption);
    }

    if (signInBackgroundImageFile?.size) {
      data.signInBackgroundImage = await this.uploadService.uploadFileToBucket(signInBackgroundImageFile, ASSET_TYPE.IMAGE, false, this.bucketOption);
    }

    if (signInBackgroundImageCompressedFile?.size) {
      data.signInBackgroundImageCompressed = await this.uploadService.uploadFileToBucket(signInBackgroundImageCompressedFile, ASSET_TYPE.IMAGE, false, this.bucketOption);
    }

    return await item.update(data);
  }
}
