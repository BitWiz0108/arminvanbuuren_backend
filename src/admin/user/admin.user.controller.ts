import { Controller, Param, Body, Get, Post, UseGuards, Put, Delete, Query, HttpCode, HttpStatus, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminUserService } from './admin.user.service';
import { AdminGuard } from '@admin/admin.guard';
import { User } from '@common/database/models/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiBearerAuth()
@ApiTags('Admin User Management')
@UseGuards(AdminGuard)
@Controller(`${process.env.API_VERSION}/admin/users`)
export class AdminUserController {
  constructor(private readonly userService: AdminUserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllUsers(
    @Query('page') page: number, 
    @Query('limit') limit: number,
    @Query('status') statusSortOrder: string,
    @Query('fullName') fullNameSortOrder: string,
    @Query('email') emailSortOrder: string,
    @Query('createdAt') createdAtSortOrder: string,
  ) {
    return this.userService.getAllUsers({
      page,
      limit,
      statusSortOrder,
      fullNameSortOrder,
      emailSortOrder,
      createdAtSortOrder
    });
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('avatarImageFile'))
  async create(@Body() data: Partial<User>, @UploadedFile() avatarImageFile: Express.Multer.File) {
    return this.userService.create(data, avatarImageFile);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('avatarImageFile'))
  async update(@Body() data: Partial<User>, @UploadedFile() avatarImageFile: Express.Multer.File) {
    return this.userService.update(data, avatarImageFile);
  }
  
  @Delete()
  @HttpCode(HttpStatus.ACCEPTED)
  async deleteUser(@Query('id') id: number) {
    await this.userService.remove(id);
  }
}
