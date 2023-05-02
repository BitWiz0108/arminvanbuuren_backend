import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import fetch from 'node-fetch';
import { EMAIL_TEMPLATE_TYPE } from '@common/constants';
import { EmailTemplate } from '@common/database/models/email-template.entity';
import { ConnectionRequestInputDto } from '@fanclub/about/dto/about.dto';
import { User } from '@common/database/models/user.entity';

@Injectable()
export class SendEmailService {
  constructor(
    @InjectModel(EmailTemplate)
    private readonly emailModel: typeof EmailTemplate,

    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async getEmailTemplate(type: EMAIL_TEMPLATE_TYPE): Promise<EmailTemplate> {
    return await this.emailModel.findOne({
      where: {
        type
      }
    });
  }

  async sendEmailVerification(email: string, forWhat: EmailTemplate, htmlContent: string): Promise<Boolean> {
    const url = process.env.SENDINBLUE_URL;
  
    const headers = {
      "Content-Type": "application/json",
      "api-key": process.env.SENDINBLUE_API_KEY,
    };

    const body = JSON.stringify({
      sender: {
        name: forWhat.fromName,
        email: forWhat.fromEmail,
      },
      to: [{ email }],
      htmlContent: htmlContent,
      subject: forWhat.subject,
    });
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body,
      });
  
      const data = await response.json();
  
      if (response.ok) {
        return true;
      } else {
        const responseText = await response.text();
        return false;
      }
    } catch (e) {
      console.log(e);
    }
    return false;
  }

  async sendEmail(payload: ConnectionRequestInputDto): Promise<Boolean> {
    const url = process.env.SENDINBLUE_URL;
  
    const headers = {
      "Content-Type": "application/json",
      "api-key": process.env.SENDINBLUE_API_KEY,
    };

    const user = await this.userModel.findByPk(1);
    const email = user.email;

    const body = JSON.stringify({
      sender: {
        name: payload.name,
        email: payload.email,
      },
      to: [{ email }],
      htmlContent: payload.message,
      subject: payload.subject,
    });

    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body,
      });
  
      const data = await response.json();
  
      if (response.ok) {
        return true;
      } else {
        const responseText = await response.text();
        return false;
      }
    } catch (e) {
      console.log(e);
    }
    return false;
  }
}
