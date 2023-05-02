import { User } from '@models/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from '@common/database/models/role.entity';
import { ArtistGenre } from '@common/database/models/artist-genre.entity';
import { Plan } from '@common/database/models/plan.entity';
import { Country } from '@common/database/models/country.entity';
import { City } from '@common/database/models/city.entity';
import { State } from '@common/database/models/state.entity';
import { ASSET_TYPE, BUCKET_ACL_TYPE, BUCKET_NAME } from '@common/constants';
import { UploadToS3Service } from '@common/services/upload-s3.service';

@Injectable()
export class ProfileService {
  private readonly bucketOption: any;

  constructor(
    @InjectModel(User)
    private readonly profileModel: typeof User,

    @InjectModel(Country)
    private readonly countryModel: typeof Country,

    @InjectModel(State)
    private readonly stateModel: typeof State,
    
    @InjectModel(City)
    private readonly cityModel: typeof City,

    private uploadService: UploadToS3Service,
  ) {
      this.bucketOption = { 
        targetBucket: BUCKET_NAME.AVATAR,
        bucketBase: process.env.AWS_S3_BUCKET_NAME,
        acl: BUCKET_ACL_TYPE.PRIVATE,
      };
  }
  
  async getProfile(id: number) : Promise<User> {
    return await this.profileModel.findByPk(id, {
      include: [
        { model: Role, as: 'role' },
        { model: ArtistGenre, as: 'genre' },
        { model: Plan, as: 'plan' },
        { model: Country, as: 'country' },
        { model: State, as: 'state' },
        { model: City, as: 'city' },
      ]
    });
  }
  
  async update(data: Partial<User>, avatarImageFile: Express.Multer.File): Promise<User> {
    const profile = await this.profileModel.findByPk(data.id);
    if (!profile) {
      throw new HttpException(`Profile with id ${data.id} not found.`, HttpStatus.BAD_REQUEST);
    }

    if (avatarImageFile) {
      data.avatarImage = await this.uploadService.uploadFileToBucket(avatarImageFile, ASSET_TYPE.IMAGE, true, this.bucketOption);
    }
    
    await profile.update(data);

    return await this.profileModel.findByPk(data.id, {
      include: [
        { model: Role, as: 'role' },
        { model: ArtistGenre, as: 'genre' },
        { model: Plan, as: 'plan' },
        { model: Country, as: 'country' },
        { model: State, as: 'state' },
        { model: City, as: 'city' },
      ]
    });
  }

  async getAllCountries(): Promise<Country[]> {
    const countries: Country[] = await this.countryModel.findAll();
    return countries;
  }

  async getAllStatesByCountryId(countryId: number): Promise<State[]> {
    const country = await this.countryModel.findByPk(Number(countryId), {
      include: [
        { model: State, as: 'states'}
      ]
    });
    return country.states;
  }

  async getAllCitiesByStateId(stateId: number): Promise<City[]> {
    const state = await this.stateModel.findByPk(Number(stateId), {
      include: [
        { model: City, as: 'cities'}
      ]
    });
    return state.cities;
  }
}
