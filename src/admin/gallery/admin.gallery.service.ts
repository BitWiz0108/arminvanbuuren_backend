import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UploadToS3Service } from '@common/services/upload-s3.service';
import { ASSET_TYPE, BUCKET_ACL_TYPE, BUCKET_NAME, MESSAGE } from '@common/constants';
import { Gallery } from '@common/database/models/gallery.entity';
import { GalleryDto } from './dto/gallery.dto';

@Injectable()
export class AdminGalleryService {
  private readonly bucketOption: any;

  constructor(
    @InjectModel(Gallery)
    private readonly galleryModel: typeof Gallery,

    private uploadService: UploadToS3Service,
  ) {
    this.bucketOption = {
      targetBucket: BUCKET_NAME.GALLERY,
      bucketBase: process.env.AWS_S3_PUBLIC_BUCKET_NAME,
      acl: BUCKET_ACL_TYPE.PUBLIC_READ,
    };
  }

  async add(data: Partial<Gallery>, imageFile: Express.Multer.File): Promise<Gallery> {
    try {
      data.image = await this.uploadService.uploadFileToBucket(imageFile, ASSET_TYPE.IMAGE, false, this.bucketOption);
      data.compressedImage = await this.uploadService.uploadFileToBucket(imageFile, ASSET_TYPE.IMAGE, true, this.bucketOption);
      
      return await this.galleryModel.create({
        image: data.image,
        compressedImage: data.compressedImage,
        size: data.size,
        description: data.description,
      });
    } catch (error) {
      throw new HttpException(MESSAGE.FAILED_UPLOAD_GALLERY, HttpStatus.BAD_REQUEST);
    }
  }

  async update(data: Partial<Gallery>, imageFile: Express.Multer.File): Promise<Gallery> {
    const item = await this.galleryModel.findByPk(data.id);

    if (!item) {
      throw new HttpException(MESSAGE.FAILED_LOAD_ITEM, HttpStatus.BAD_REQUEST);
    }

    if (imageFile) {
      data.image = await this.uploadService.uploadFileToBucket(imageFile, ASSET_TYPE.IMAGE, false, this.bucketOption);
      data.compressedImage = await this.uploadService.uploadFileToBucket(imageFile, ASSET_TYPE.IMAGE, true, this.bucketOption);
    }

    return await item.update(data);
  }

  async findAll(): Promise<GalleryDto> {
    const data: GalleryDto = {
      images: await this.galleryModel.findAll()
    }
    return data;
  }

  async remove(id: number): Promise<void> {
    const item = await this.galleryModel.findByPk(id);
    if (!item) {
      throw new HttpException(MESSAGE.FAILED_FETCH_GALLERY, HttpStatus.BAD_REQUEST);
    }
    await item.destroy();
  }
}
