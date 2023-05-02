import { Controller, Param, Body, Get, Post, UseGuards, Put, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminLanguageService } from './admin.language.service';
import { AdminGuard } from '@admin/admin.guard';
import { Language } from '@models/language.entity';

@ApiBearerAuth()
@ApiTags('Admin Language')
@UseGuards(AdminGuard)
@Controller(`${process.env.API_VERSION}/admin/language`)
export class AdminLanguageController {
    constructor(private readonly languageService: AdminLanguageService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll() {
      return this.languageService.findAll();
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async add(@Body() data: Language) {
      return this.languageService.add(data);
    }

    @Put()
    @HttpCode(HttpStatus.ACCEPTED)
    async update(
      @Body() data: Partial<Language>,
    ) {
      const language = await this.languageService.update(
        data.id,
        data,
      );
      return language;
    }

    @Delete()
    @HttpCode(HttpStatus.ACCEPTED)
    async deleteItem(@Query('id') id: number) {
      await this.languageService.remove(id);
    }
}
