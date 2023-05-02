import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminPlanService } from './admin.plan.service';
import { AdminPlanController } from './admin.plan.controller';
import { Plan } from '@common/database/models/plan.entity';
import { UploadToS3Service } from '@common/services/upload-s3.service';

@Module({
  imports: [SequelizeModule.forFeature([ Plan ])],
  providers: [ AdminPlanService, UploadToS3Service ],
  controllers: [ AdminPlanController ],
})
export class AdminPlanModule {}
