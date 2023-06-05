import { ConflictException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as fb from 'fb';
import { User } from '@models/user.entity';
import { Role } from '@models/role.entity';
import { AuthInput } from './dto/auth.input';
import { AuthInfo, OAuthSigninArgs, SigninArgs, } from './dto/signin.args';
import { ROLES_KEY, Roles } from './roles.decorator';
import { ROLES } from './role.enum';
import { Plan } from '@common/database/models/plan.entity';
import { PasswordReset } from '@common/database/models/password-reset.entity';
import { MESSAGE, OAUTH_PROVIDER, PASSWORD_RESET_FORM } from '@common/constants';
import * as moment from 'moment';
import { payment } from 'paypal-rest-sdk';
import { OAuth } from '@common/database/models/oauth.entity';
const fetch = require('node-fetch');

const crypto = require('crypto')
const appleSigninAuth = require('apple-signin-auth')

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private readonly authModel: typeof User,
    @InjectModel(Role)
    private readonly roleModel: typeof Role,
    @InjectModel(PasswordReset)
    private readonly passwordResetModel: typeof PasswordReset,
    @InjectModel(OAuth)
    private readonly oauthModel: typeof OAuth,

    private jwtService: JwtService,
  ) {}

  async oauth(signinArgs: OAuthSigninArgs): Promise<AuthInfo> {
    const oauth = await this.oauthModel.findOne({
      where: {
        provider: signinArgs.provider
      }
    });

    if (oauth.provider == OAUTH_PROVIDER.FACEBOOK) {
      fb.options({ appId: oauth.appId, appSecret: oauth.appSecret });
      const fields = 'id, name, email';
      const user_info_fb = await fb.api('me', { fields, access_token: signinArgs.accessToken });

      console.log('fb info', user_info_fb);
      // Use Sequelize to query your database for the user with the Facebook ID returned by the `fb.api` method.
      let user = await this.authModel.findOne({ where: { facebookId: user_info_fb.id } });

      if (!user) {
        // User not found, create a new user in your database.
        user = await this.authModel.create({
          facebookId: user_info_fb.id,
          email: user_info_fb.email,
          username: user_info_fb.name,
        });
        const access_token = this.jwtService.sign({ id: user.id });
        return {
          user: user,
          accessToken: access_token
        };
      }
    }

    if (oauth.provider == OAUTH_PROVIDER.APPLE) {
      //replace the throw with your own error logic
      if(!signinArgs.appleData) throw new HttpException(MESSAGE.NOT_INCLUDE_APPLE_DATA, HttpStatus.BAD_REQUEST);

      let {nonce, id, email, firstName, lastName, identityToken } = signinArgs.appleData
      let appleIdTokenClaims = await appleSigninAuth.verifyIdToken(identityToken, {
        /* sha256 hex hash of raw nonce */
        nonce: nonce ? crypto.createHash('sha256').update(nonce).digest('hex') : undefined,
      });
      // if (!appleIdTokenClaims || appleIdTokenClaims.aud != 'com.app.ArminVanBuuren')
      if (!appleIdTokenClaims || appleIdTokenClaims.aud != oauth.appId)
        throw new HttpException(MESSAGE.INVALID_TOKEN, HttpStatus.BAD_REQUEST);
      
      let user = await this.authModel.findOne({ where: { appleId: id } });
      if(!user) {
        user = await this.authModel.create({
          appleId: id,
          email: email,
          username: `${firstName} ${lastName}`,
        });
      }
      const access_token = this.jwtService.sign({ id: user.id });
      return {
        user: user,
        accessToken: access_token
      };
    }

    if (oauth.provider == OAUTH_PROVIDER.GOOGLE) {
      let url = `https://oauth2.googleapis.com/tokeninfo?id_token=${signinArgs.accessToken}`
      let response = await fetch(url)
      let data: any = await response.json()
      //I'm not sure if you save this in google authmodel, if yes, replace the raw data with the db field
      // if (data.aud !== '232802954486-aioi0pt5padb447akphe9ch4un964ki4.apps.googleusercontent.com')
      if (data.aud !== oauth.appId)
        throw new HttpException(MESSAGE.INVALID_TOKEN, HttpStatus.BAD_REQUEST);
      let user = await this.authModel.findOne({ where: { googleId: data.sub } });
      if(!user) {
        user = await this.authModel.create({
          googleId: data.sub,
          email: data.email,
          username: `${data.name}`,
        });
      }
      const access_token = this.jwtService.sign({ id: user.id });
      return {
        user: user,
        accessToken: access_token
      };
    }

  }

  async signin(signinArgs: SigninArgs): Promise<AuthInfo> {
    const user = await this.authModel.findOne({
      where: { username: signinArgs.username },
      include: [
        { model: Role, as: 'role', },
        { model: Plan, as: 'plan', }
      ]
    });
    if (user && bcrypt.compareSync(signinArgs.password, user.password)) {
      const payload = { id: user.id };
      const access_token = this.jwtService.sign(payload);
      return { user: user, accessToken: access_token, };
    } else {
      throw new HttpException('Invalid username or password', HttpStatus.UNAUTHORIZED);
    }
  }

  async checkAuth(req: any): Promise<AuthInfo> {
    const access_token = req.headers.authorization.split(' ')[1];
    const user = await this.authModel.findByPk(req.user.id, {
      include: [
        { model: Plan, as: 'plan', },
        { model: Role, as: 'role', }
      ]
    });
    const auth_info: AuthInfo = {
        user: req.user,
        accessToken: access_token
    };

    return auth_info;
  }

  async updatePassword(payload: any): Promise<User> {
    const id = payload.id;
    const oldPassword = payload.oldPassword;
    const newPassword = payload.newPassword;

    const user = await this.authModel.findByPk(id);
    if (user && bcrypt.compareSync(oldPassword, user.password)) {
      user.password = bcrypt.hashSync(newPassword, 10);
      await user.save();
      return user;
    } else {
        throw new UnauthorizedException("wrong password");
    }
  }

  async addUser(data: AuthInput): Promise<User> {
    const find_user = await this.authModel.findOne({
      where: {
        username: data.username
      }
    });

    if (find_user) {
      throw new HttpException(MESSAGE.USER_ALREADY_EXISTS, HttpStatus.CONFLICT);
    }

    let roleId = ROLES.FAN; // normal fan as default
    let newUser = {
      username: data.username,
      email: data.email,
      password: bcrypt.hashSync(data.password, 10),
      status: false,
    };
    
    try {
      return this.authModel.create({ ...newUser, roleId });
    } catch (error) {
      throw new Error(error);
    }
  }

  async remove(id: string): Promise<boolean> {
    const auth = await this.authModel.findByPk(id);
    if (auth) {
      await auth.destroy();
      return true;
    } else return false;
  }

  async validateUserById(user_id: number): Promise<User> {
    return await this.authModel.findOne({ where: { id: user_id }, include: [
      {
        model: Role,
      }
    ]},);
  }

  async findByEmail(email: string): Promise<User> {
    return this.authModel.findOne({
      where: { email },
    });
  }

  async createTokenForPasswordReset(user: User) {
    const token = this.jwtService.sign({ id: user.id });
    await this.passwordResetModel.create({
      token,
      email: user.email,
    });
    return token;
  }

  async findByTokenForResetPassword(token: string): Promise<PasswordReset> {
    return this.passwordResetModel.findOne({
      where: { token },
    });
  }

  async findByEmailForEmailVerification(email: string): Promise<PasswordReset[]> {
    return this.passwordResetModel.findAll({
      where: { email }
    });
  }

  async resetPassword(user: User, newPassword: string): Promise<void> {
    user.password = bcrypt.hashSync(newPassword, 10);
    await user.save();
  }

  async verifyEmail(user: User): Promise<void> {
    user.status = true;
    user.emailVerifiedAt = moment().format("YYYY-MM-DD hh:mm:ss");
    await user.save();
  }
}
