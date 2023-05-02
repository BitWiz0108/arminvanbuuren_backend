import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Plan } from '@common/database/models/plan.entity';
import { Currency } from '@common/database/models/currency.entity';
import { UploadToS3Service } from '@common/services/upload-s3.service';
import { ASSET_TYPE, BUCKET_ACL_TYPE, BUCKET_NAME } from '@common/constants';

@Injectable()
export class AdminPlanService {
  private readonly bucketOption: any;

  constructor(
    @InjectModel(Plan)
    private readonly planModel: typeof Plan,
    
    private uploadService: UploadToS3Service,
  ) {
    this.bucketOption = { 
      targetBucket: BUCKET_NAME.PLAN,
      bucketBase: process.env.AWS_S3_BUCKET_NAME,
      acl: BUCKET_ACL_TYPE.PRIVATE,
    };
  }

  async add(data: Partial<Plan>, file: Express.Multer.File) : Promise<Plan> {
    if (file) {
      data.coverImage = await this.uploadService.uploadFileToBucket(file, ASSET_TYPE.IMAGE, true, this.bucketOption);
      
      const newPlan = await this.planModel.create({
        coverImage: data.coverImage,
        name: data.name,
        description: data.description,
        price: data.price,
        duration: data.duration,
        currencyId: data.currencyId,
      });

      const newItem = await this.planModel.findByPk(newPlan.id, {
        include: [
          { model: Currency, as: "currency" }
        ]
      });

      return newItem;
    } else {
      const newPlan = await this.planModel.create({
        name: data.name,
        description: data.description,
        price: data.price,
        duration: data.duration,
        currencyId: data.currencyId,
      });
      
      const newItem = await this.planModel.findByPk(newPlan.id, {
        include: [
          { model: Currency, as: "currency" }
        ]
      });

      return newItem;
    }
  }

  async update(
    data: Partial<Plan>,
    file: Express.Multer.File
  ): Promise<Plan> {
    const item = await this.planModel.findByPk(data.id);
    if (!item) {
      throw new HttpException(`Plan with id ${data.id} not found.`, HttpStatus.BAD_REQUEST);
    }

    if (file?.size) { // if imageFile exists
      data.coverImage = data.coverImage = await this.uploadService.uploadFileToBucket(file, ASSET_TYPE.IMAGE, true, this.bucketOption);
    }

    await item.update(data);
    const updatedItem = this.planModel.findByPk(data.id, {
      include: [
        { model: Currency, as: 'currency' },
      ]
    });

    return updatedItem;
  }

  async findAll(): Promise<Plan[]> {
    const plans: Plan[] = await this.planModel.findAll({ 
      include: [
        { model: Currency, as: 'currency' },
      ]
    });

    return plans;
  }

  async remove(id: number): Promise<void> {
    const item = await this.planModel.findByPk(id);
    if (!item) {
      throw new HttpException(`Plan with id ${id} not found.`, HttpStatus.BAD_REQUEST);
    }
    await item.destroy();
  }
}
