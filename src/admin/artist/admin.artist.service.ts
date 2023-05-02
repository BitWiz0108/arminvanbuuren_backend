import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@models/user.entity';
import { AdminArtistInfoDto } from './dto/artist.dto';
import { Country } from '@models/country.entity';
import { State } from '@models/state.entity';
import { City } from '@models/city.entity';
import { UploadToS3Service } from '@common/services/upload-s3.service';
import { ASSET_TYPE, BUCKET_ACL_TYPE, BUCKET_NAME, MESSAGE } from '@common/constants';

@Injectable()
export class AdminArtistService {
  private readonly bucketOption: any;
  private readonly secondBucketOption: any;

  constructor(
    @InjectModel(User)
    private readonly artistModel: typeof User,

    private uploadService: UploadToS3Service,
  ) {
    this.bucketOption = { 
      targetBucket: BUCKET_NAME.BANNER,
      bucketBase: process.env.AWS_S3_BUCKET_NAME,
      acl: BUCKET_ACL_TYPE.PRIVATE,
    };

    this.secondBucketOption = {
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
      throw new Error(`Artist with id ${data.id} not found.`);
    }
    const bannerImageFile: Express.Multer.File = files[0];
    const avatarImageFile: Express.Multer.File = files[1];
    const logoImageFile: Express.Multer.File = files[2];

    if (bannerImageFile?.size) {
      data.bannerImage = await this.uploadService.uploadFileToBucket(bannerImageFile, ASSET_TYPE.IMAGE, true, this.bucketOption);
    }

    if (avatarImageFile?.size) {
      data.avatarImage = await this.uploadService.uploadFileToBucket(avatarImageFile, ASSET_TYPE.IMAGE, true, this.bucketOption);
    }

    if (logoImageFile?.size) {
      data.logoImage = await this.uploadService.uploadFileToBucket(logoImageFile, ASSET_TYPE.IMAGE, false, this.secondBucketOption);
    }
    await item.update(data);
    const updatedItem : AdminArtistInfoDto = await this.artistModel.findByPk(data.id);

    return updatedItem;
  }

  async getArtistInfo(id: number): Promise<AdminArtistInfoDto> {
    try {
      
      const artist = await this.artistModel.findByPk(id, {
        include: [
          { model: City, as: 'city' },
          { model: State, as: 'state' },
          { model: Country, as: 'country' },
        ]
      });
  
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
        bannerImage: artist.bannerImage,
        avatarImage: artist.avatarImage,
        logoImage: artist.logoImage,
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
