import { User } from '@common/database/models/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserViewOption } from './dto/user-option-dto';
import { ArtistGenre } from '@common/database/models/artist-genre.entity';
import { Role } from '@common/database/models/role.entity';
import { Plan } from '@common/database/models/plan.entity';
import { AdminUsersPaginatedDto } from './dto/user.dto';
import { UploadToS3Service } from '@common/services/upload-s3.service';
import { ASSET_TYPE, BUCKET_ACL_TYPE, BUCKET_NAME } from '@common/constants';
import * as moment from 'moment';
import * as bcrypt from 'bcrypt';
import { ROLES } from '@common-modules/auth/role.enum';

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
      bucketBase: process.env.AWS_S3_PUBLIC_BUCKET_NAME,
      acl: BUCKET_ACL_TYPE.PUBLIC_READ,
    };
  }

  async getAllUsers(op: UserViewOption): Promise<AdminUsersPaginatedDto> {
    const limit = Number(op.limit); // ensure limit is a number
    const page = Number(op.page);
    let orders: any = [];

    if (op.statusSortOrder) {
      orders.push(['status', op.statusSortOrder]);
    }

    if (op.fullNameSortOrder) {
      orders.push(['firstName', op.fullNameSortOrder]);
      orders.push(['lastName', op.fullNameSortOrder]);
    }

    if (op.emailSortOrder) {
      orders.push(['email', op.emailSortOrder]);
    }

    if (op.createdAtSortOrder) {
      orders.push(['createdAt', op.createdAtSortOrder]);
    }

    if (!orders.length) {
      orders.push(['createdAt', 'DESC']);
    }

    const users: User[] = await this.userModel.findAll({
      offset: (page - 1) * limit,
      limit: limit,
      order: orders,
      include: [
        { model: Role, as: 'role', },
        { model: Plan, as: 'plan', },
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

  async create(data: Partial<User>, avatarImageFile: Express.Multer.File): Promise<User> {
    if (avatarImageFile?.size) {
      data.avatarImage = await this.uploadService.uploadFileToBucket(avatarImageFile, ASSET_TYPE.IMAGE, false, this.bucketOption);
    }

    const newItem = await this.userModel.create({
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      avatarImage: data.avatarImage,
      gender: data.gender,
      dob: data.dob,
      emailVerifiedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
      password: bcrypt.hashSync(data.password, 10),
      roleId: ROLES.FAN,
      status: 1,
      address: data.address,
      country: data.country,
      state: data.state,
      city: data.city,
      zipcode: data.zipcode,
    });
    
    const newUser = await this.userModel.findByPk(newItem.id, {
      include: [
        { model: Role, as: 'role' }
      ]
    });
    return newUser;
  }

  async update(data: Partial<User>, avatarImageFile: Express.Multer.File): Promise<User> {
    const profile = await this.userModel.findByPk(data.id);
    if (!profile) {
      throw new HttpException(`Profile with id ${data.id} not found.`, HttpStatus.BAD_REQUEST);
    }

    if (avatarImageFile) {
      data.avatarImage = await this.uploadService.uploadFileToBucket(avatarImageFile, ASSET_TYPE.IMAGE, false, this.bucketOption);
    }
    
    await profile.update(data);

    return await this.userModel.findByPk(data.id, {
      include: [
        { model: Role, as: 'role' },
        { model: ArtistGenre, as: 'genre' },
        { model: Plan, as: 'plan' },
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
