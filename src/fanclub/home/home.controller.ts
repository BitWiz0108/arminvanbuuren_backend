import { Controller, Param, Body, Get, Post, HttpCode, HttpStatus, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { HomeService } from './home.service';
import { Roles } from '@common/modules/auth/roles.decorator';

@ApiBearerAuth()
@ApiTags('Home')
@Controller(`${process.env.API_VERSION}/home`)
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Roles()
  @Get()
  @HttpCode(HttpStatus.OK)
  async getHomeData() {
    return this.homeService.getHomeData();
  }
}
