import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminCategoryService } from './admin.category.service';
import { AdminCategoryController } from './admin.category.controller';
import { Category } from '@models/category.entity';
import { UploadToS3Service } from '@common/services/upload-s3.service';
import { CategoryLivestream } from '@common/database/models/category-livestream.entity';

@Module({
  imports: [SequelizeModule.forFeature([ Category, CategoryLivestream ])],
  providers: [ AdminCategoryService, UploadToS3Service ],
  controllers: [ AdminCategoryController ],
})
export class AdminCategoryModule {}
