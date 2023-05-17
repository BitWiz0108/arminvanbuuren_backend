import { ASSET_TYPE, BUCKET_ACL_TYPE, BUCKET_NAME, MESSAGE } from '@common/constants';
import { CoverImage } from '@common/database/models/cover-images.entity';
import { UploadToS3Service } from '@common/services/upload-s3.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class AdminAboutService {
  private readonly bucketOption: any;

  constructor(
    @InjectModel(CoverImage)
    private readonly aboutModel: typeof CoverImage,
    
    private uploadService: UploadToS3Service,
  ) {
    this.bucketOption = {
      targetBucket: BUCKET_NAME.ABOUT,
      bucketBase: process.env.AWS_S3_PUBLIC_BUCKET_NAME,
      acl: BUCKET_ACL_TYPE.PUBLIC_READ,
    };
  }

  async loadCoverImages() {
    return await this.aboutModel.findOne();
  }

  async update(
    files: Express.Multer.File[],
  ): Promise<CoverImage> {
    const item = await this.aboutModel.findOne();
    if (!item) {
      throw new HttpException(MESSAGE.FAILED_TO_FETCH_TOS_DATA, HttpStatus.BAD_REQUEST);
    }

    const coverImageFile1: Express.Multer.File = files[0];
    const coverImageFile2: Express.Multer.File = files[1];

    if (coverImageFile1?.size) {
      item.coverImage1 = await this.uploadService.uploadFileToBucket(coverImageFile1, ASSET_TYPE.IMAGE, false, this.bucketOption);
    }

    if (coverImageFile2?.size) {
      item.coverImage2 = await this.uploadService.uploadFileToBucket(coverImageFile2, ASSET_TYPE.IMAGE, false, this.bucketOption);
    }

    return await item.save();
  }
}
