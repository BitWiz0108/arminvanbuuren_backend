import { CoverImage } from '@common/database/models/cover-images.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class AboutService {
  constructor(
    @InjectModel(CoverImage)
    private readonly coverImageModel: typeof CoverImage,

  ) {}
  
  async getCoverImages(): Promise<CoverImage> {
    return await this.coverImageModel.findOne();
  }

}
