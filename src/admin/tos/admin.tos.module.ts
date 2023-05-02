import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminTOSService } from './admin.tos.service';
import { AdminTOSController } from './admin.tos.controller';
import { TOS } from '@common/database/models/tos.entity';

@Module({
  imports: [SequelizeModule.forFeature([ TOS ])],
  providers: [ AdminTOSService, ],
  controllers: [ AdminTOSController ],
})
export class AdminTOSModule {}
