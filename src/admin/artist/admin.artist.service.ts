import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@models/user.entity';
import { AdminArtistInfoDto } from './dto/artist.dto';
import { UploadToS3Service } from '@common/services/upload-s3.service';
import { ASSET_TYPE, BANNER_TYPE, BUCKET_ACL_TYPE, BUCKET_NAME, MESSAGE } from '@common/constants';

@Injectable()
export class AdminArtistService {
  private readonly bucketOption: any;

  constructor(
    @InjectModel(User)
    private readonly artistModel: typeof User,

    private uploadService: UploadToS3Service,
  ) {
    this.bucketOption = {
      targetBucket: BUCKET_NAME.LOGO,
      bucketBase: process.env.AWS_S3_PUBLIC_BUCKET_NAME,
      acl: BUCKET_ACL_TYPE.PUBLIC_READ,
    }
  }

  async update(
    data: Partial<User>,
    files: Express.Multer.File[],
  ): Promise<AdminArtistInfoDto> {
    const item = await this.artistModel.findByPk(data.id);
    if (!item) {
      throw new HttpException(MESSAGE.FAILED_LOAD_ITEM, HttpStatus.BAD_REQUEST);
    }
    const bannerImageFile: Express.Multer.File = data.bannerType == BANNER_TYPE.IMAGE ? files[0] : null;
    const bannerImageCompressedFile: Express.Multer.File = data.bannerType == BANNER_TYPE.IMAGE ? files[1] : null;
    const bannerVideoFile: Express.Multer.File = data.bannerType == BANNER_TYPE.VIDEO ? files[0] : null;
    const bannerVideoCompressedFile: Express.Multer.File = data.bannerType == BANNER_TYPE.VIDEO ? files[1] : null;
    const avatarImageFile: Express.Multer.File = files[2];
    const logoImageFile: Express.Multer.File = files[3];

    if (bannerImageFile?.size) {
      data.bannerImage = await this.uploadService.uploadFileToBucket(bannerImageFile, ASSET_TYPE.IMAGE, false, this.bucketOption);
    }

    if (bannerImageCompressedFile?.size) {
      data.bannerImageCompressed = await this.uploadService.uploadFileToBucket(bannerImageCompressedFile, ASSET_TYPE.IMAGE, false, this.bucketOption);
    }

    if (bannerVideoFile?.size) {
      data.bannerVideo = await this.uploadService.uploadFileToBucket(bannerVideoFile, ASSET_TYPE.VIDEO, false, this.bucketOption);
    }

    if (bannerVideoCompressedFile?.size) {
      data.bannerVideoCompressed = await this.uploadService.uploadFileToBucket(bannerVideoCompressedFile, ASSET_TYPE.VIDEO, false, this.bucketOption);
    }

    if (avatarImageFile?.size) {
      data.avatarImage = await this.uploadService.uploadFileToBucket(avatarImageFile, ASSET_TYPE.IMAGE, false, this.bucketOption);
    }

    if (logoImageFile?.size) {
      data.logoImage = await this.uploadService.uploadFileToBucket(logoImageFile, ASSET_TYPE.IMAGE, false, this.bucketOption);
    }
    await item.update(data);
    const updatedItem : AdminArtistInfoDto = await this.artistModel.findByPk(data.id);

    return updatedItem;
  }

  async getArtistInfo(id: number): Promise<AdminArtistInfoDto> {
    try {
      
      const artist = await this.artistModel.findByPk(id);
  
      const data: AdminArtistInfoDto = {
        id: artist.id,
        username: artist.username,
        firstName: artist.firstName,
        lastName: artist.lastName,
        artistName: artist.artistName,
        dob: artist.dob,
        email: artist.email,
        website: artist.website,
        description: artist.description,
        address: artist.address,
        bannerType: artist.bannerType,
        bannerImage: artist.bannerImage,
        bannerImageCompressed: artist.bannerImageCompressed,
        bannerVideo: artist.bannerVideo,
        bannerVideoCompressed: artist.bannerVideoCompressed,
        avatarImage: artist.avatarImage,
        logoImage: artist.logoImage,
        mobile: artist.mobile,
        country: artist.country,
        state: artist.state,
        city: artist.city,
        facebook: artist.facebook,
        instagram: artist.instagram,
        youtube: artist.youtube,
        twitter: artist.twitter,
        soundcloud: artist.soundcloud,
      }
  
      return new Promise((resolve, reject) => {
        resolve(data);
      });
    } catch (error) {
      throw new HttpException(MESSAGE.FAILED_LOAD_ARTIST_INFO, HttpStatus.BAD_REQUEST);
    }
    
  }

}
