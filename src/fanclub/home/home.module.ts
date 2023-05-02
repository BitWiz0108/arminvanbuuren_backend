import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { Home } from '@common/database/models/home.entity';

@Module({
  imports: [SequelizeModule.forFeature([ Home ])],
  providers: [ HomeService, ],
  controllers: [ HomeController ],
})

export class HomeModule {}
