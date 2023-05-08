import { Controller, Param, Body, Get, Post, HttpCode, HttpStatus, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@common-modules/auth/role.enum';
import { Roles } from '@common-modules/auth/roles.decorator';
import { ProfileService } from './profile.service';
import { User } from '@models/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiBearerAuth()
@ApiTags('Profile')
@Controller(`${process.env.API_VERSION}/profile`)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Roles()
  @Get()
  @HttpCode(HttpStatus.OK)
  async getProfile(@Query('id') id: number) {
    return this.profileService.getProfile(id);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('avatarImageFile'))
  async update(
    @Body() data: Partial<User>,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.profileService.update(
      data,
      file,
    );
  }

}
