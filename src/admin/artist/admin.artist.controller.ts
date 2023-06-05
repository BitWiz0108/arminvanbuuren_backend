import { Controller, Param, Body, Get, Post, UseGuards, Put, Delete, Query, HttpCode, HttpStatus, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminArtistService } from './admin.artist.service';
import { AdminGuard } from '@admin/admin.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { User } from '@models/user.entity';
import { SubscriptionDto } from './dto/artist.dto';

@ApiBearerAuth()
@ApiTags('Admin Artist')
@UseGuards(AdminGuard)
@Controller(`${process.env.API_VERSION}/admin/artist`)
export class AdminArtistController {
  constructor(private readonly artistService: AdminArtistService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async artistInfo(
    @Query('id') id: number
  ) {
    return this.artistService.getArtistInfo(id);
  }

  @Put()
  @HttpCode(HttpStatus.ACCEPTED)
  @UseInterceptors(FilesInterceptor('files'))
  async update(
    @Body() data: Partial<User>,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return await this.artistService.update(
      data,
      files,
    );
  }

  @Get('subscription-description')
  @HttpCode(HttpStatus.OK)
  async getSubscriptionDescription(
    @Query('artistId') artistId: number
  ) {
    return await this.artistService.getSubscriptionDescription(artistId);
  }

  @Put('subscription-description')
  @HttpCode(HttpStatus.ACCEPTED)
  async updateSubscriptionDescription(@Body() data: SubscriptionDto) {
    return await this.artistService.updateSubscriptionDescription(data);
  }
}
