import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { OAuth } from '@common/database/models/oauth.entity';
import { MESSAGE, OAUTH_PROVIDER } from '@common/constants';

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

  async getOAuths(): Promise<any> {
    const cnt = await this.oauthModel.count();
    if (!cnt) {
      throw new HttpException(MESSAGE.NEED_OAUTH_INITIALIZE, HttpStatus.BAD_REQUEST);
    }

    const facebookOAuth = await this.oauthModel.findOne({
      where: {
        provider: OAUTH_PROVIDER.FACEBOOK,
      }
    });

    const googleOAuth = await this.oauthModel.findOne({
      where: {
        provider: OAUTH_PROVIDER.GOOGLE,
      }
    });

    const appleOAuth = await this.oauthModel.findOne({
      where: {
        provider: OAUTH_PROVIDER.APPLE,
      }
    });

    const res: any = {
      facebookAppId: facebookOAuth.appId,
      facebookAppSecret: facebookOAuth.appSecret,
      appleAppId: appleOAuth.appId,
      appleAppSecret: appleOAuth.appSecret,
      googleAppId: googleOAuth.appId,
      googleAppSecret: googleOAuth.appSecret,
    };

    return res;
  }
}
