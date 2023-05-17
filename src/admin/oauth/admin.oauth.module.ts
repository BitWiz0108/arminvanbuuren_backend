import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminOAuthService } from './admin.oauth.service';
import { AdminOAuthController } from './admin.oauth.controller';
import { OAuth } from '@common/database/models/oauth.entity';

@Module({
  imports: [SequelizeModule.forFeature([ OAuth ])],
  providers: [ AdminOAuthService ],
  controllers: [ AdminOAuthController ],
})
export class AdminOAuthModule {}
