import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { SequelizeModule } from '@nestjs/sequelize';
import { MulterModule } from '@nestjs/platform-express';
import { config } from 'dotenv';
config();

import { RolesGuard } from 'src/common/modules/auth/roles.guard';

import { AdminModule } from './admin/admin.module';
import { FanPanelModule } from './fanclub/fanpanel.module';
import { CommonModule } from './common/common.module';

import { User } from '@models/user.entity';
import { JwtAuthGuard } from '@common-modules/auth/jwt-auth.guard';
import { multerConfig } from '@config/app.config';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadModels: true,
      synchronize: true,
      logging: false,
    }),
    SequelizeModule.forFeature([User]),
    MulterModule.register(multerConfig),
    AdminModule,
    FanPanelModule,
    CommonModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})

export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer;
  }
}
