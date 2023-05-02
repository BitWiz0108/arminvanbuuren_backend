import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminArtistService } from './admin.artist.service';
import { AdminArtistController } from './admin.artist.controller';
import { User } from '@models/user.entity';
import { UploadToS3Service } from '@common/services/upload-s3.service';

@Module({
  imports: [SequelizeModule.forFeature([ User ])],
  providers: [ AdminArtistService, UploadToS3Service ],
  controllers: [ AdminArtistController ],
})
export class AdminArtistModule {}
