import { Controller, Param, Body, Get, Post, UseGuards, Put, Delete, Query, HttpCode, HttpStatus, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminPostService } from './admin.post.service';
import { AdminGuard } from '@admin/admin.guard';
import { PostPartialDto, PostPayloadDto } from './dto/post-option.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@ApiBearerAuth()
@ApiTags('Admin Post')
@UseGuards(AdminGuard)
@Controller(`${process.env.API_VERSION}/admin/post`)
export class AdminPostController {
  constructor(private readonly postService: AdminPostService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('page') page: number, @Query('limit') limit: number
  ) {
    return this.postService.findAll({ page, limit });
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FilesInterceptor('files'))
  async add(
    @Body() data: PostPayloadDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.postService.add(data, files);
  }

  @Put()
  @HttpCode(HttpStatus.ACCEPTED)
  @UseInterceptors(FilesInterceptor('files'))
  async update(
    @Body() data: PostPartialDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const post = await this.postService.update(data, files);
    return post;
  }

  @Delete()
  @HttpCode(HttpStatus.ACCEPTED)
  async deleteItem(@Query('id') id: number) {
    await this.postService.remove(id);
  }

  @Delete('delete-replies')
  @HttpCode(HttpStatus.ACCEPTED)
  async deleteReplies(@Body() data: any) {
    await this.postService.removeReplies(data);
  }
}
