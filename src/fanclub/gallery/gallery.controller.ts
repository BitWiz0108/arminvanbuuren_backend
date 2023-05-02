import { Controller, Param, Body, Get, Post, HttpCode, HttpStatus, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GalleryService } from './gallery.service';
import { Roles } from '@common/modules/auth/roles.decorator';

@ApiBearerAuth()
@ApiTags('Gallery')
@Controller(`${process.env.API_VERSION}/gallery`)
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Roles()
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllGalleryImages() {
    return this.galleryService.getAllGalleryImages();
  }
}
