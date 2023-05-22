import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from '@models/category.entity';
import { User } from '@models/user.entity';
import { UploadToS3Service } from '@common/services/upload-s3.service';
import { ASSET_TYPE, BUCKET_ACL_TYPE, BUCKET_NAME, MESSAGE } from '@common/constants';

@Injectable()
export class AdminCategoryService {
  private readonly bucketOption: any;

  constructor(
    @InjectModel(Category)
    private readonly categoryModel: typeof Category,

    private uploadService: UploadToS3Service,
  ) {
    this.bucketOption = {
      targetBucket: BUCKET_NAME.CATEGORY,
      bucketBase: process.env.AWS_S3_PUBLIC_BUCKET_NAME,
      acl: BUCKET_ACL_TYPE.PUBLIC_READ,
    };
  }

  async add(data: Partial<Category>, imageFile: Express.Multer.File): Promise<Category> {
    try {
      data.image = await this.uploadService.uploadFileToBucket(imageFile, ASSET_TYPE.IMAGE, false, this.bucketOption);
      
      const newCategoryItem: Category = await this.categoryModel.create({
        image: data.image, // use the CloudFront full file path as the `image` column value
        name: data.name,
        userId: data.userId,
        description: data.description,
        copyright: data.copyright,
        releaseDate: data.releaseDate,
      });

      const newItem = await this.categoryModel.findByPk(newCategoryItem.id, {
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
    data: Partial<Category>,
    file: Express.Multer.File
  ): Promise<Category> {
    const item = await this.categoryModel.findByPk(data.id);
    if (!item) {
      throw new HttpException(MESSAGE.FAILED_LOAD_ITEM, HttpStatus.BAD_REQUEST);
    }
    
    if (file) {
      data.image = await this.uploadService.uploadFileToBucket(file, ASSET_TYPE.IMAGE, false, this.bucketOption);
    }
    
    await item.update(data);

    return await this.categoryModel.findByPk(data.id, {
      include: [
        { model: User, as: 'creator' }
      ]
    });
  }

  async findAll(): Promise<Category[]> {
    return this.categoryModel.findAll({
      order: [['releaseDate', 'DESC']],
      include: [{ model: User, as: 'creator' }],
    });
  }

  findOne(id: number): Promise<Category> {
    return this.categoryModel.findByPk(id);
  }

  async remove(id: number): Promise<void> {
    const item = await this.categoryModel.findByPk(id);
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
