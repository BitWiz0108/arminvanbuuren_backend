import { Home } from '@common/database/models/home.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class HomeService {
  constructor(
    @InjectModel(Home)
    private readonly homeModel: typeof Home,

  ) {}
  
  async getHomeData(): Promise<Home> {
    return await this.homeModel.findOne();
  }
}
