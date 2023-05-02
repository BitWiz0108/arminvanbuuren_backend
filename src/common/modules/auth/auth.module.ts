import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { User } from '@models/user.entity';
import { Role } from '@models/role.entity';
import { State } from '@models/state.entity';
import { City } from '@models/city.entity';
import { Country } from '@models/country.entity';
import { PasswordReset } from '@common/database/models/password-reset.entity';
import { SendEmailService } from '@common/services/send-email.service';
import { EmailTemplate } from '@common/database/models/email-template.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Role, Country, State, City, PasswordReset, EmailTemplate, ]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' }, // 24 hours
    }),
  ],
  providers: [ AuthService, JwtStrategy, SendEmailService, ],
  controllers: [AuthController],
})
export class AuthModule {}
