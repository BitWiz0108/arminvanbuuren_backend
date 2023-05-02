import { TOS } from '@common/database/models/tos.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class TOSService {
  constructor(
    @InjectModel(TOS)
    private readonly tosModel: typeof TOS,

  ) {}
  
  async getContent(): Promise<TOS> {
    return await this.tosModel.findOne();
  }
}
