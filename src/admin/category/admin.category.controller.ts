import { Controller, Param, Body, Get, Post, UseGuards, Put, Delete, Query, HttpCode, HttpStatus, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminCategoryService } from './admin.category.service';
import { AdminGuard } from '@admin/admin.guard';
import { Category } from '@models/category.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiBearerAuth()
@ApiTags('Admin Category')
@UseGuards(AdminGuard)
@Controller(`${process.env.API_VERSION}/admin/category`)
export class AdminCategoryController {
    constructor(private readonly categoryService: AdminCategoryService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll() {
      return this.categoryService.findAll();
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(FileInterceptor('imageFile'))
    async add(@Body() data: Partial<Category>, @UploadedFile() imageFile: Express.Multer.File) {
      const result = await this.categoryService.add(data, imageFile);
      return result;
    }

    @Put()
    @HttpCode(HttpStatus.ACCEPTED)
    @UseInterceptors(FileInterceptor('imageFile'))
    async update(
      @Body() data: Partial<Category>,
      @UploadedFile() file: Express.Multer.File,
    ) {
      const Category = await this.categoryService.update(data, file);
      return Category;
    }

    @Delete()
    @HttpCode(HttpStatus.ACCEPTED)
    async deleteItem(@Query('id') id: number) {
      await this.categoryService.remove(id);
    }
}
