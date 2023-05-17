import { Controller, Param, Body, Get, Post, UseGuards, Put, Delete, Query, HttpCode, HttpStatus, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminOAuthService } from './admin.oauth.service';
import { AdminGuard } from '@admin/admin.guard';
import { OAuth } from '@common/database/models/oauth.entity';
import { Role } from '@common-modules/auth/role.enum';
import { Roles } from '@common/modules/auth/roles.decorator';

@ApiBearerAuth()
@ApiTags('Admin OAuth')
@Controller(`${process.env.API_VERSION}/admin/oauth`)
export class AdminOAuthController {
  constructor(private readonly oauthService: AdminOAuthService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getOAuths(@Query('provider') provider: string) {
    return this.oauthService.getOAuths(provider);
  }

  @Put()
  @HttpCode(HttpStatus.ACCEPTED)
  async update(
    @Body() data: Partial<OAuth>,
  ) {
    return await this.oauthService.update(data);
  }
}
