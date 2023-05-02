import { ASSET_TYPE, BUCKET_ACL_TYPE, BUCKET_NAME, MESSAGE } from '@common/constants';
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
    file: Express.Multer.File
  ): Promise<Home> {
    const item = await this.homeModel.findOne();
    if (!item) {
      throw new HttpException(MESSAGE.FAILED_FETCH_HOME_DATA, HttpStatus.BAD_REQUEST);
    }

    if (file?.size) {
      data.backgroundVideo = await this.uploadService.uploadFileToBucket(file, ASSET_TYPE.VIDEO, false, this.bucketOption);
    }

    return await item.update(data);
  }
}
