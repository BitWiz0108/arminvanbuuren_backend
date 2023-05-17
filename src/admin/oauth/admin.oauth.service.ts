import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { OAuth } from '@common/database/models/oauth.entity';
import { MESSAGE } from '@common/constants';

@Injectable()
export class AdminOAuthService {
  constructor(
    @InjectModel(OAuth)
    private readonly oauthModel: typeof OAuth,
    
  ) {}

  async update(
    data: Partial<OAuth>,
  ): Promise<OAuth> {
    const oauth = await this.oauthModel.findOne({
      where: {
        provider: data.provider
      }
    });
    if (!oauth) {
      throw new HttpException(MESSAGE.FAILED_LOAD_ITEM, HttpStatus.BAD_REQUEST);
    }

    return await oauth.update(data);
  }

  async getOAuths(provider: string): Promise<OAuth> {
    const cnt = this.oauthModel.count();
    if (!cnt) {
      throw new HttpException(MESSAGE.NEED_OAUTH_INITIALIZE, HttpStatus.BAD_REQUEST);
    }

    const oauth = await this.oauthModel.findOne({
      where: {
        provider: provider
      }
    });

    return oauth;
  }
}
