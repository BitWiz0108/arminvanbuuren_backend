import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GalleryService } from './gallery.service';
import { GalleryController } from './gallery.controller';
import { Gallery } from '@common/database/models/gallery.entity';

@Module({
  imports: [SequelizeModule.forFeature([ Gallery, ])],
  providers: [ GalleryService, ],
  controllers: [ GalleryController ],
})

export class GalleryModule {}
