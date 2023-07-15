import { Gallery } from '@common/database/models/gallery.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GalleryDto } from './dto/gallery.dto';

@Injectable()
export class GalleryService {
  constructor(
    @InjectModel(Gallery)
    private readonly galleryModel: typeof Gallery,

  ) {}
  
  async getAllGalleryImages(): Promise<GalleryDto> {
    const images = await this.galleryModel.findAll({
      order: [['order_id', 'ASC']],
    });
    const result: GalleryDto = {
      images: images,
    }
    return result;
  }
}
