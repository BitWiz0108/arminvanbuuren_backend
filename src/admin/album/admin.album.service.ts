import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Album } from '@models/album.entity';
import { User } from '@models/user.entity';
import { UploadToS3Service } from '@common/services/upload-s3.service';
import { ASSET_TYPE, BUCKET_ACL_TYPE, BUCKET_NAME, MESSAGE } from '@common/constants';
import { AlbumMusic } from '@common/database/models/album-music.entity';

@Injectable()
export class AdminAlbumService {
  private readonly bucketOption: any;

  constructor(
    @InjectModel(Album)
    private readonly albumModel: typeof Album,

    @InjectModel(AlbumMusic)
    private readonly albumMusicModel: typeof AlbumMusic,

    private uploadService: UploadToS3Service,
  ) {
    this.bucketOption = {
      targetBucket: BUCKET_NAME.ALBUM,
      bucketBase: process.env.AWS_S3_PUBLIC_BUCKET_NAME,
      acl: BUCKET_ACL_TYPE.PUBLIC_READ,
    };
  }

  async add(data: Partial<Album>, imageFile: Express.Multer.File): Promise<Album> {
    try {
      data.image = await this.uploadService.uploadFileToBucket(imageFile, ASSET_TYPE.IMAGE, false, this.bucketOption);
      
      const newAlbumItem: Album = await this.albumModel.create({
        image: data.image, // use the CloudFront full file path as the `image` column value
        name: data.name,
        userId: data.userId,
        description: data.description,
        copyright: data.copyright,
        releaseDate: data.releaseDate,
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
      data.image = await this.uploadService.uploadFileToBucket(file, ASSET_TYPE.IMAGE, false, this.bucketOption);
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
      order: [['releaseDate', 'DESC']],
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

    const albumMusics = await this.albumMusicModel.findAll({
      where: {
        albumId: id,
      }
    });

    const promises = albumMusics.map(async albumMusic => {
      await albumMusic.destroy();
    });

    await Promise.all(promises);

    await item.destroy();
  }
}
