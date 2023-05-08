import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { User } from '@common/database/models/user.entity';
import { Role } from '@common/database/models/role.entity';
import { ArtistGenre } from '@common/database/models/artist-genre.entity';
import { Plan } from '@common/database/models/plan.entity';
import { UploadToS3Service } from '@common/services/upload-s3.service';

@Module({
  imports: [SequelizeModule.forFeature([User, Role, ArtistGenre, Plan, ])],
  providers: [ ProfileService, UploadToS3Service ],
  controllers: [ ProfileController ],
})
export class ProfileModule {}
