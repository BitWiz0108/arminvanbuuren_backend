import { Controller, Param, Body, Post, Request, UseGuards, HttpStatus, HttpCode, HttpException, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { User } from '@models/user.entity';
import { Role } from './role.enum';
import { Roles } from './roles.decorator';
import { AuthInput, ForgotPasswordInputDto, PasswordResetInputDto, ResendVerificationLinkInputDto, VerifyEmailInputDto } from './dto/auth.input';
import { AuthInfo, OAuthSigninArgs, SigninArgs } from './dto/signin.args';
import { EMAIL_VERIFY_FORM, MESSAGE, PASSWORD_RESET_FORM } from '@common/constants';
import { JwtService } from '@nestjs/jwt';
import * as moment from 'moment';
import { SendEmailService } from '@common/services/send-email.service';
import { EMAIL_TEMPLATE_TYPE } from '@common/constants';

@ApiBearerAuth()
@ApiTags('Auth')
@Controller(`${process.env.API_VERSION}/auth`)
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly jwtService: JwtService,
        private readonly sendEmailService: SendEmailService,
    ) {}

    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    async signup(@Body() payload: AuthInput) {
        const user = await this.authService.addUser(payload);
        
        // send email verification link to email //
        const token = await this.authService.createTokenForPasswordReset(user);

        const emailTemplate = await this.sendEmailService.getEmailTemplate(EMAIL_TEMPLATE_TYPE.EMAIL_VERIFICATION);

        emailTemplate.html = emailTemplate.html.replace(new RegExp("{{CONTENT}}", 'g'), `${emailTemplate.content}`);
        emailTemplate.html = emailTemplate.html.replace(new RegExp("{{APP_BASE_URL}}", 'g'), `${process.env.APP_BASE_URL}`);
        emailTemplate.html = emailTemplate.html.replace(new RegExp("{{TOKEN}}", 'g'), `${token}`);
        emailTemplate.html = emailTemplate.html.replace(new RegExp("{{TITLE}}", 'g'), `${emailTemplate.title}`);
        emailTemplate.html = emailTemplate.html.replace(new RegExp("{{LOGO_IMAGE}}", 'g'), `${emailTemplate.logoImage}`);

        const htmlContent = emailTemplate.html;

        const result = await this.sendEmailService.sendEmailVerification(user.email, emailTemplate, htmlContent);
        // End - send email verification link to email //
        if (result) {
            return { message: MESSAGE.EMAIL_VERIFICATION_LINK_SENT };
        } else {
            throw new HttpException(MESSAGE.EMAIL_VERIFICATION_ERROR, HttpStatus.BAD_REQUEST);
        }
    }

    @Post('signin')
    @HttpCode(HttpStatus.OK)
    async signin(@Body() payload: SigninArgs): Promise<AuthInfo> {
        const auth_info = await this.authService.signin(payload);
        return auth_info;
    }

    @Post('oauth')
    @HttpCode(HttpStatus.OK)
    async oauth(@Body() payload: OAuthSigninArgs): Promise<AuthInfo> {
        const auth_info = await this.authService.oauth(payload);
        return auth_info;
    }

    @Post('check-auth')
    @HttpCode(HttpStatus.OK)
    async checkAuth(@Request() req: any): Promise<AuthInfo> {
        const auth_info = await this.authService.checkAuth(req);
        return auth_info;
    }

    @Post('forgot-password')
    @HttpCode(HttpStatus.OK)
    async forgotPassword(@Body() body: ForgotPasswordInputDto) {
        const user = await this.authService.findByEmail(body.email);
        if (!user) {
            throw new HttpException(MESSAGE.USER_NOT_FOUND, HttpStatus.BAD_REQUEST);
        }

        const token = await this.authService.createTokenForPasswordReset(user);

        const emailTemplate = await this.sendEmailService.getEmailTemplate(EMAIL_TEMPLATE_TYPE.EMAIL_VERIFICATION);

        emailTemplate.html = emailTemplate.html.replace(new RegExp("{{CONTENT}}", 'g'), `${emailTemplate.content}`);
        emailTemplate.html = emailTemplate.html.replace(new RegExp("{{APP_BASE_URL}}", 'g'), `${process.env.APP_BASE_URL}`);
        emailTemplate.html = emailTemplate.html.replace(new RegExp("{{TOKEN}}", 'g'), `${token}`);
        emailTemplate.html = emailTemplate.html.replace(new RegExp("{{TITLE}}", 'g'), `${emailTemplate.title}`);
        emailTemplate.html = emailTemplate.html.replace(new RegExp("{{LOGO_IMAGE}}", 'g'), `${emailTemplate.logoImage}`);

        const htmlContent = emailTemplate.html;
        const result = await this.sendEmailService.sendEmailVerification(user.email, emailTemplate, htmlContent);
        if (result) {
            return { message: MESSAGE.PASSWORD_RESET_LINK_SENT };
        } else {
            throw new HttpException(MESSAGE.PASSWORD_RESET_ERROR, HttpStatus.BAD_REQUEST);
        }
    }

    @Post('reset-password')
    @HttpCode(HttpStatus.OK)
    async resetPassword(@Body() body: PasswordResetInputDto) {
        const passwordReset = await this.authService.findByTokenForResetPassword(body.token);
        if (!passwordReset) {
            throw new HttpException(MESSAGE.INVALID_TOKEN, HttpStatus.BAD_REQUEST);
        }

        const user = await this.authService.findByEmail(passwordReset.email);
        if (!user) {
            throw new HttpException(MESSAGE.USER_NOT_FOUND, HttpStatus.BAD_REQUEST);
        }

        await passwordReset.destroy();
        await this.authService.resetPassword(user, body.password);
        return { message: MESSAGE.PASSWORD_RESET_SUCCEEDED };
    }

    @Post('verify-email')
    @HttpCode(HttpStatus.OK)
    async verifyEmail(@Body() body: VerifyEmailInputDto) {
        const userForVerification = await this.authService.findByTokenForResetPassword(body.token);
        if (!userForVerification) {
            throw new HttpException(MESSAGE.INVALID_TOKEN, HttpStatus.BAD_REQUEST);
        }
        
        const user = await this.authService.findByEmail(userForVerification.email);
        if (!user) {
            throw new HttpException(MESSAGE.USER_NOT_FOUND, HttpStatus.BAD_REQUEST);
        }
        await userForVerification.destroy();

        await this.authService.verifyEmail(user);

        return { message: MESSAGE.VERIFY_EMAIL_SUCCEEDED };
    }

    @Post('resend-verification-link')
    @HttpCode(HttpStatus.OK)
    async resendVerificationLink(@Body() body: ResendVerificationLinkInputDto) {
        const usersForVerification = await this.authService.findByEmailForEmailVerification(body.email);

        usersForVerification.forEach(async item => {
            await item.destroy();
        });

        const user = await this.authService.findByEmail(body.email);

        // send email verification link to email //
        const token = await this.authService.createTokenForPasswordReset(user);

        const emailTemplate = await this.sendEmailService.getEmailTemplate(EMAIL_TEMPLATE_TYPE.EMAIL_VERIFICATION);

        emailTemplate.html = emailTemplate.html.replace(new RegExp("{{CONTENT}}", 'g'), `${emailTemplate.content}`);
        emailTemplate.html = emailTemplate.html.replace(new RegExp("{{APP_BASE_URL}}", 'g'), `${process.env.APP_BASE_URL}`);
        emailTemplate.html = emailTemplate.html.replace(new RegExp("{{TOKEN}}", 'g'), `${token}`);
        emailTemplate.html = emailTemplate.html.replace(new RegExp("{{TITLE}}", 'g'), `${emailTemplate.title}`);
        emailTemplate.html = emailTemplate.html.replace(new RegExp("{{LOGO_IMAGE}}", 'g'), `${emailTemplate.logoImage}`);

        const htmlContent = emailTemplate.html;

        const result = await this.sendEmailService.sendEmailVerification(user.email, emailTemplate, htmlContent);
        // End - send email verification link to email //
        if (result) {
            return { message: MESSAGE.EMAIL_VERIFICATION_LINK_RESENT };
        } else {
            throw new HttpException(MESSAGE.EMAIL_VERIFICATION_ERROR, HttpStatus.BAD_REQUEST);
        }
    }

    @Get('servertime')
    @HttpCode(HttpStatus.OK)
    async getServerTime() {
        const now = moment().format("YYYY-MM-DD HH:mm:ss");
        return { datetime: now };
    }

    @Post('change-password')
    @HttpCode(HttpStatus.ACCEPTED)
    async changePassword(@Body() payload: any) {
        return await this.authService.updatePassword(payload);
    }
}
