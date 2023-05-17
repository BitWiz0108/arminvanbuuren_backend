import { User } from '@models/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from '@common/database/models/role.entity';
import { ArtistGenre } from '@common/database/models/artist-genre.entity';
import { Plan } from '@common/database/models/plan.entity';
import { ASSET_TYPE, BUCKET_ACL_TYPE, BUCKET_NAME, MESSAGE } from '@common/constants';
import { UploadToS3Service } from '@common/services/upload-s3.service';

@Injectable()
export class ProfileService {
  private readonly bucketOption: any;

  constructor(
    @InjectModel(User)
    private readonly profileModel: typeof User,

    private uploadService: UploadToS3Service,
  ) {
      this.bucketOption = { 
        targetBucket: BUCKET_NAME.AVATAR,
        bucketBase: process.env.AWS_S3_PUBLIC_BUCKET_NAME,
        acl: BUCKET_ACL_TYPE.PUBLIC_READ,
      };
  }
  
  async getProfile(id: number) : Promise<User> {
    return await this.profileModel.findByPk(id, {
      include: [
        { model: Role, as: 'role' },
        { model: ArtistGenre, as: 'genre' },
        { model: Plan, as: 'plan' },
      ]
    });
  }
  
  async update(data: Partial<User>, avatarImageFile: Express.Multer.File): Promise<User> {
    const profile = await this.profileModel.findByPk(data.id);
    if (!profile) {
      throw new HttpException(MESSAGE.FAILED_LOAD_ITEM, HttpStatus.BAD_REQUEST);
    }

    if (avatarImageFile) {
      data.avatarImage = await this.uploadService.uploadFileToBucket(avatarImageFile, ASSET_TYPE.IMAGE, true, this.bucketOption);
    }
    
    await profile.update(data);

    return await this.profileModel.findByPk(data.id, {
      include: [
        { model: Role, as: 'role' },
        { model: ArtistGenre, as: 'genre' },
        { model: Plan, as: 'plan' },
      ]
    });
  }
}
