import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UploadToS3Service } from '@common/services/upload-s3.service';
import { ASSET_TYPE, BUCKET_ACL_TYPE, BUCKET_NAME, MESSAGE, POST_FILE_TYPE } from '@common/constants';
import { Gallery } from '@common/database/models/gallery.entity';
import { GalleryDto } from './dto/gallery.dto';
import { Op, Transaction } from 'sequelize';
import sequelize from 'sequelize';

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

  async add(data: Partial<Gallery>, files: Express.Multer.File[]): Promise<Gallery> {
    if (data.type == POST_FILE_TYPE.IMAGE) {
      if (files[0]?.size)
        data.image = await this.uploadService.uploadFileToBucket(files[0], ASSET_TYPE.IMAGE, false, this.bucketOption);
      if (files[1]?.size)
        data.imageCompressed = await this.uploadService.uploadFileToBucket(files[1], ASSET_TYPE.IMAGE, false, this.bucketOption);
    }
    
    if (data.type == POST_FILE_TYPE.VIDEO) {
      if (files[0]?.size)
        data.video = await this.uploadService.uploadFileToBucket(files[0], ASSET_TYPE.VIDEO, false, this.bucketOption);
      if (files[1]?.size)
        data.videoCompressed = await this.uploadService.uploadFileToBucket(files[1], ASSET_TYPE.VIDEO, false, this.bucketOption);
    }

    let newItem = await this.galleryModel.create({
      type: data.type,
      image: data.image ? data.image : null,
      imageCompressed: data.imageCompressed ? data.imageCompressed : null,
      video: data.video ? data.video : null,
      videoCompressed: data.videoCompressed ? data.videoCompressed : null,
      size: data.size,
      description: data.description,
    });

    newItem.orderId = newItem.id;
    await newItem.save();

    return newItem;
  }

  async update(data: Partial<Gallery>, files: Express.Multer.File[]): Promise<Gallery> {
    const item = await this.galleryModel.findByPk(data.id);

    if (!item) {
      throw new HttpException(MESSAGE.FAILED_LOAD_ITEM, HttpStatus.BAD_REQUEST);
    }

    if (data.type == POST_FILE_TYPE.IMAGE) {
      if (files[0]?.size)
        data.image = await this.uploadService.uploadFileToBucket(files[0], ASSET_TYPE.IMAGE, false, this.bucketOption);
      if (files[1]?.size)
        data.imageCompressed = await this.uploadService.uploadFileToBucket(files[1], ASSET_TYPE.IMAGE, false, this.bucketOption);
    }
    
    if (data.type == POST_FILE_TYPE.VIDEO) {
      if (files[0]?.size)
        data.video = await this.uploadService.uploadFileToBucket(files[0], ASSET_TYPE.VIDEO, false, this.bucketOption);
      if (files[1]?.size)
        data.videoCompressed = await this.uploadService.uploadFileToBucket(files[1], ASSET_TYPE.VIDEO, false, this.bucketOption);
    }

    return await item.update(data);
  }

  async findAll(): Promise<GalleryDto> {
    const data: GalleryDto = {
      images: await this.galleryModel.findAll({
        order: [
          ['order_id', 'ASC']
        ]
      })
    }
    return data;
  }

  async rearrange(data: any) : Promise<any> {
    const sourceOrderId = Number(data.sourceOrderId);
    const destinationOrderId = Number(data.destinationOrderId);
  
    let itemsToUpdate = [];
  
    try {
      const items = await this.galleryModel.findAll({
        where: {
          orderId: {
            [Op.between]: sourceOrderId < destinationOrderId ? [sourceOrderId, destinationOrderId] : [destinationOrderId, sourceOrderId]
          }
        },
        order: [['order_id', 'ASC']],
      });
  
      if (sourceOrderId < destinationOrderId && items.length >= 2) {
        for (let i = items.length - 1; i > 0; i --) {
          items[i].orderId = items[i - 1].orderId;
          itemsToUpdate.push(items[i]);
        }
        items[0].orderId = destinationOrderId;
        itemsToUpdate.push(items[0]);
      } else if (sourceOrderId > destinationOrderId && items.length >= 2) {
        for (let i = 0; i < items.length - 1; i ++) {
          items[i].orderId = items[i + 1].orderId;
          itemsToUpdate.push(items[i]);
        }
        items[items.length - 1].orderId = destinationOrderId;
        itemsToUpdate.push(items[items.length - 1]);
      }
  
      for (const item of itemsToUpdate) {
        await item.save();
      }
      
    } catch (err) {
      throw err;  // re-throw the error to handle it in the higher layers
    }
  
    return new Promise((resolve, reject) => {
      resolve({
        message: "success",
      });
    });
  }  

  async remove(id: number): Promise<void> {
    const item = await this.galleryModel.findByPk(id);
    if (!item) {
      throw new HttpException(MESSAGE.FAILED_FETCH_GALLERY, HttpStatus.BAD_REQUEST);
    }
    await item.destroy();
  }
}
