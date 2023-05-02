import { Controller, Param, Body, Get, Post, UseGuards, Put, Delete, Query, HttpCode, HttpStatus, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminPostService } from './admin.post.service';
import { AdminGuard } from '@admin/admin.guard';
import { PostPartialDto, PostPayloadDto } from './dto/post-option.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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
    @UseInterceptors(FileInterceptor('imageFile'))
    async add(
      @Body() data: PostPayloadDto, 
      @UploadedFile() imageFile: Express.Multer.File,
    ) {
      return this.postService.add(data, imageFile);
    }

    @Put()
    @HttpCode(HttpStatus.ACCEPTED)
    @UseInterceptors(FileInterceptor('imageFile'))
    async update(
      @Body() data: PostPartialDto,
      @UploadedFile() imageFile: Express.Multer.File,
    ) {
      const post = await this.postService.update(
        data,
        imageFile,
      );
      return post;
    }

    @Delete()
    @HttpCode(HttpStatus.ACCEPTED)
    async deleteItem(@Query('id') id: number) {
      await this.postService.remove(id);
    }
}
