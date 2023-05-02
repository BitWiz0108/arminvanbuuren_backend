import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminLanguageService } from './admin.language.service';
import { AdminLanguageController } from './admin.language.controller';
import { Language } from '@models/language.entity';

@Module({
  imports: [SequelizeModule.forFeature([ Language ])],
  providers: [ AdminLanguageService ],
  controllers: [ AdminLanguageController ],
})
export class AdminLanguageModule {}
