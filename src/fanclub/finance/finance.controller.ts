import { Controller, Param, Body, Get, Post, HttpCode, HttpStatus, UseInterceptors, UploadedFile, Query, Req, HttpException } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@common-modules/auth/role.enum';
import { Roles } from '@common-modules/auth/roles.decorator';
import { FinanceService } from './finance.service';
import { Transaction } from '@common/database/models/transaction.entity';
import { SendEmailService } from '@common/services/send-email.service';
import { MESSAGE } from '@common/constants';
import { EMAIL_TEMPLATE_TYPE } from '@common/constants';

@ApiBearerAuth()
@ApiTags('Finance')
@Controller(`${process.env.API_VERSION}/finance`)
export class FinanceController {
    constructor(
      private readonly finService: FinanceService,
      private readonly sendEmailService: SendEmailService
    ) {}

    @Roles()
    @Post('transact')
    @HttpCode(HttpStatus.OK)
    async transact(
      @Body() data: Partial<Transaction>,
      @Req() req: any
    ) {
      const transaction = this.finService.transact(data, req);

      const emailTemplate = await this.sendEmailService.getEmailTemplate(EMAIL_TEMPLATE_TYPE.EMAIL_VERIFICATION);

      emailTemplate.html = emailTemplate.html.replace(new RegExp("{{CONTENT}}", 'g'), `${emailTemplate.content}`);
      emailTemplate.html = emailTemplate.html.replace(new RegExp("{{APP_BASE_URL}}", 'g'), `${process.env.APP_BASE_URL}`);
      emailTemplate.html = emailTemplate.html.replace(new RegExp("{{TITLE}}", 'g'), `${emailTemplate.title}`);
      emailTemplate.html = emailTemplate.html.replace(new RegExp("{{LOGO_IMAGE}}", 'g'), `${emailTemplate.logoImage}`);

      const htmlContent = emailTemplate.html;

      const result = await this.sendEmailService.sendEmailVerification(req.user.email, emailTemplate, htmlContent);
      if (result) {
        return transaction;
      } else {
          throw new HttpException(MESSAGE.SEND_THANK_EMAIL_ERROR, HttpStatus.BAD_REQUEST);
      }
    }

    @Roles()
    @Get('plans')
    @HttpCode(HttpStatus.OK)
    async getAllPlans() {
      return this.finService.getAllPlans();
    }

    @Roles()
    @Get('currencies')
    @HttpCode(HttpStatus.OK)
    async getAllCurrencies() {
      return this.finService.getAllCurrencies();
    }
}
