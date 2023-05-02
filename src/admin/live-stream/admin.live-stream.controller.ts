import { Controller, Param, Body, Get, Post, UseGuards, Put, Delete, Query, HttpCode, HttpStatus, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@common-modules/auth/role.enum';
import { Roles } from '@common-modules/auth/roles.decorator';
import { AdminLiveStreamService } from './admin.live-stream.service';
import { LiveStream } from '@models/live-stream.entity';
import { AdminGuard } from '@admin/admin.guard';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiBearerAuth()
@ApiTags('Admin Live Stream')
@UseGuards(AdminGuard)
@Controller(`${process.env.API_VERSION}/admin/live-stream`)
export class AdminLiveStreamController {
    constructor(private readonly livestreamService: AdminLiveStreamService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(@Query('page') page: number, @Query('limit') limit: number) {
      return this.livestreamService.findAll({page, limit});
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(FilesInterceptor('files'))
    async add(
      @Body() data: Partial<LiveStream>,
      @UploadedFiles() files: Array<Express.Multer.File>,
    ) {
      const result = await this.livestreamService.add(data, files);
      return result;
    }

    @Put()
    @HttpCode(HttpStatus.ACCEPTED)
    @UseInterceptors(FilesInterceptor('files'))
    async update(
      @Body() data: Partial<LiveStream>,
      @UploadedFiles() files: Array<Express.Multer.File>,
    ) {
      const album = await this.livestreamService.update(data, files);
      return album;
    }

    @Delete()
    @HttpCode(HttpStatus.ACCEPTED)
    async deleteItem(@Query('id') id: number) {
      await this.livestreamService.remove(id);
    }
}
