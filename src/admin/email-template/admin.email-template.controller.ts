import { Controller, Param, Body, Get, Post, UseGuards, Put, Delete, Query, HttpCode, HttpStatus, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminEmailTemplateService } from './admin.email-template.service';
import { AdminGuard } from '@admin/admin.guard';
import { EmailTemplate } from '@common/database/models/email-template.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { EMAIL_TEMPLATE_TYPE } from '@common/constants';

@ApiBearerAuth()
@ApiTags('Admin Email Templates')
@UseGuards(AdminGuard)
@Controller(`${process.env.API_VERSION}/admin/email-templates`)
export class AdminEmailTemplateController {
  constructor(private readonly emailService: AdminEmailTemplateService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getEmailTemplate(
    @Query('type') type: EMAIL_TEMPLATE_TYPE
  ) {
    return this.emailService.getEmailTemplate(type);
  }

  @Put()
  @HttpCode(HttpStatus.ACCEPTED)
  @UseInterceptors(FileInterceptor('imageFile'))
  async updateEmailTemplate(
    @Body() data: Partial<EmailTemplate>,
    @UploadedFile() imageFile: Express.Multer.File,
  ) {
    return this.emailService.updateEmailTemplate(data, imageFile);
  }
}
