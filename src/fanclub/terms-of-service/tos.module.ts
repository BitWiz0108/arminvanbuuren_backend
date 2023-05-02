import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TOSService } from './tos.service';
import { TOSController } from './tos.controller';
import { TOS } from '@common/database/models/tos.entity';

@Module({
  imports: [SequelizeModule.forFeature([ TOS, ])],
  providers: [ TOSService, ],
  controllers: [ TOSController ],
})
export class TOSModule {}
