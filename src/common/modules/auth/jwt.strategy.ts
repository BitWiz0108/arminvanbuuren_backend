import { Strategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor( private authService: AuthService ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any, done: VerifiedCallback) {
    const user = await this.authService.validateUserById(payload.id);
    if (!user) {
      return done(new UnauthorizedException(), false);
    }
    done(null, user);
  }
}
