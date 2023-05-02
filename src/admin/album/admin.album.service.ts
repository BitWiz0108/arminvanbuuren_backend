import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Album } from '@models/album.entity';
import { User } from '@models/user.entity';
import { UploadToS3Service } from '@common/services/upload-s3.service';
import { ASSET_TYPE, BUCKET_ACL_TYPE, BUCKET_NAME, MESSAGE } from '@common/constants';

@Injectable()
export class AdminAlbumService {
  private readonly bucketOption: any;

  constructor(
    @InjectModel(Album)
    private readonly albumModel: typeof Album,

    private uploadService: UploadToS3Service,
  ) {
    this.bucketOption = {
      targetBucket: BUCKET_NAME.ALBUM,
      bucketBase: process.env.AWS_S3_BUCKET_NAME,
      acl: BUCKET_ACL_TYPE.PRIVATE,
    };
  }

  async add(data: Partial<Album>, imageFile: Express.Multer.File): Promise<Album> {
    try {
      data.image = await this.uploadService.uploadFileToBucket(imageFile, ASSET_TYPE.IMAGE, true, this.bucketOption);
      
      console.log('image', data.image);
      const newAlbumItem: Album = await this.albumModel.create({
        image: data.image, // use the CloudFront full file path as the `image` column value
        name: data.name,
        userId: data.userId,
        description: data.description,
        copyright: data.copyright,
      });

      const newItem = await this.albumModel.findByPk(newAlbumItem.id, {
        include: [
          { model: User, as: 'creator' }
        ]
      });

      return newItem;
    } catch (error) {
      throw new HttpException(MESSAGE.FAILED_CREATE_ITEM, HttpStatus.BAD_REQUEST);
    }
  }

  async update(
    data: Partial<Album>,
    file: Express.Multer.File
  ): Promise<Album> {
    const item = await this.albumModel.findByPk(data.id);
    if (!item) {
      throw new HttpException(MESSAGE.FAILED_LOAD_ITEM, HttpStatus.BAD_REQUEST);
    }
    
    if (file) {
      data.image = await this.uploadService.uploadFileToBucket(file, ASSET_TYPE.IMAGE, true, this.bucketOption);
    }
    
    await item.update(data);

    return await this.albumModel.findByPk(data.id, {
      include: [
        { model: User, as: 'creator' }
      ]
    });
  }

  async findAll(): Promise<Album[]> {
    return this.albumModel.findAll({
      include: [{ model: User, as: 'creator' }],
    });
  }

  findOne(id: number): Promise<Album> {
    return this.albumModel.findByPk(id);
  }

  async remove(id: number): Promise<void> {
    const item = await this.albumModel.findByPk(id);
    if (!item) {
      throw new HttpException(MESSAGE.FAILED_LOAD_ITEM, HttpStatus.BAD_REQUEST);
    }
    try {
      await item.destroy();
    } catch (error) {
      throw new HttpException(MESSAGE.FAILED_REMOVE_ITEM, HttpStatus.BAD_REQUEST);
    }
  }
}
