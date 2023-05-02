import { Controller, Param, Body, Get, Post, UseGuards, Put, Delete, Query, HttpCode, HttpStatus, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminPlanService } from './admin.plan.service';
import { AdminGuard } from '@admin/admin.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Plan } from '@common/database/models/plan.entity';

@ApiBearerAuth()
@ApiTags('Admin Plan')
@UseGuards(AdminGuard)
@Controller(`${process.env.API_VERSION}/admin/plans`)
export class AdminPlanController {
  constructor(private readonly planService: AdminPlanService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return this.planService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('imageFile'))
  async add(
    @Body() data: Partial<Plan>, 
    @UploadedFile() imageFile: Express.Multer.File,
  ) {
    return this.planService.add(data, imageFile);
  }

  @Put()
  @HttpCode(HttpStatus.ACCEPTED)
  @UseInterceptors(FileInterceptor('imageFile'))
  async update(
    @Body() data: Partial<Plan>,
    @UploadedFile() imageFile: Express.Multer.File,
  ) {
    const post = await this.planService.update(
      data,
      imageFile,
    );
    return post;
  }

  @Delete()
  @HttpCode(HttpStatus.ACCEPTED)
  async deleteItem(@Query('id') id: number) {
    await this.planService.remove(id);
  }
}
