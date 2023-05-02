import { MESSAGE } from '@common/constants';
import { TOS } from '@common/database/models/tos.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class AdminTOSService {

  constructor(
    @InjectModel(TOS)
    private readonly tosModel: typeof TOS,
    
  ) {}

  async getTOSContent() {
    return await this.tosModel.findOne();
  }

  async update(
    data: Partial<TOS>,
  ): Promise<TOS> {
    const item = await this.tosModel.findOne();
    if (!item) {
      throw new HttpException(MESSAGE.FAILED_TO_FETCH_TOS_DATA, HttpStatus.BAD_REQUEST);
    }

    return await item.update(data);
  }
}
