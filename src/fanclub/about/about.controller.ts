import { Controller, Param, Body, Get, Post, HttpCode, HttpStatus, UseInterceptors, UploadedFile, Query, HttpException } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AboutService } from './about.service';
import { ConnectionRequestInputDto } from './dto/about.dto';
import { SendEmailService } from '@common/services/send-email.service';
import { MESSAGE } from '@common/constants';

@ApiBearerAuth()
@ApiTags('About')
@Controller(`${process.env.API_VERSION}/about`)
export class AboutController {
  constructor(
    private readonly aboutService: AboutService,
    private readonly sendEmailService: SendEmailService,
  ) {}

  @Get('images')
  @HttpCode(HttpStatus.OK)
  async getCoverImages() {
    return this.aboutService.getCoverImages();
  }

  @Post('connect')
  @HttpCode(HttpStatus.OK)
  async receiveConnectRequest(@Body() payload: ConnectionRequestInputDto) {
    const result = await this.sendEmailService.sendEmail(payload);
    if (result) {
      return {
        "message": MESSAGE.RECEIVED_MESSAGE,
      };
    } else {
        throw new HttpException(MESSAGE.SEND_EMAIL_ERROR, HttpStatus.BAD_REQUEST);
    }
  }
}
