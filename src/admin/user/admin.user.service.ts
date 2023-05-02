import { User } from '@common/database/models/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserViewOption } from './dto/user-option-dto';
import { ArtistGenre } from '@common/database/models/artist-genre.entity';
import { Role } from '@common/database/models/role.entity';
import { Plan } from '@common/database/models/plan.entity';
import { Country } from '@common/database/models/country.entity';
import { State } from '@common/database/models/state.entity';
import { City } from '@common/database/models/city.entity';
import { AdminUsersPaginatedDto } from './dto/user.dto';
import { UploadToS3Service } from '@common/services/upload-s3.service';
import { ASSET_TYPE, BUCKET_ACL_TYPE, BUCKET_NAME } from '@common/constants';


@Injectable()
export class AdminUserService {
  private readonly bucketOption: any;

  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,

    private uploadService: UploadToS3Service,
  ) {
    this.bucketOption = { 
      targetBucket: BUCKET_NAME.AVATAR,
      bucketBase: process.env.AWS_S3_BUCKET_NAME,
      acl: BUCKET_ACL_TYPE.PRIVATE,
    };
  }

  async getAllUsers(op: UserViewOption): Promise<AdminUsersPaginatedDto> {
    const limit = Number(op.limit); // ensure limit is a number
    const page = Number(op.page);
    const users: User[] = await this.userModel.findAll({ 
      offset: (page - 1) * limit, 
      limit: limit,
      include: [
        { model: Role, as: 'role', },
        { model: Plan, as: 'plan', },
        { model: Country, as: 'country', },
        { model: State, as: 'state', },
        { model: City, as: 'city', },
      ]
    });

    const totalItems = await this.userModel.count();
    const pages: number = Math.ceil(totalItems / limit);

    const data : AdminUsersPaginatedDto = {
      pages: pages,
      users: users,
    };
    return data;
  }

  async update(data: Partial<User>, avatarImageFile: Express.Multer.File): Promise<User> {
    const profile = await this.userModel.findByPk(data.id);
    if (!profile) {
      throw new HttpException(`Profile with id ${data.id} not found.`, HttpStatus.BAD_REQUEST);
    }

    if (avatarImageFile) {
      data.avatarImage = await this.uploadService.uploadFileToBucket(avatarImageFile, ASSET_TYPE.IMAGE, true, this.bucketOption);
    }
    
    await profile.update(data);

    return await this.userModel.findByPk(data.id, {
      include: [
        { model: Role, as: 'role' },
        { model: ArtistGenre, as: 'genre' },
        { model: Plan, as: 'plan' },
        { model: Country, as: 'country' },
        { model: State, as: 'state' },
        { model: City, as: 'city' },
      ]
    });
  }

  async remove(id: number): Promise<void> {
    const item = await this.userModel.findByPk(id);
    if (!item) {
      throw new HttpException(`User with id ${id} not found.`, HttpStatus.BAD_REQUEST);
    }
    await item.destroy();
  }
}
