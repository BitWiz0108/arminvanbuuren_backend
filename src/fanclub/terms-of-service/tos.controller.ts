import { Controller, Param, Body, Get, Post, HttpCode, HttpStatus, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TOSService } from './tos.service';

@ApiBearerAuth()
@ApiTags('Terms of Service')
@Controller(`${process.env.API_VERSION}/termsofservice`)
export class TOSController {
  constructor(private readonly tosService: TOSService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getContext() {
    return this.tosService.getContent();
  }
}
