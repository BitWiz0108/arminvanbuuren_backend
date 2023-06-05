import { User } from "@models/user.entity";

export class SigninArgs {
  readonly username: string;
  readonly password: string;
}

export class OAuthSigninArgs {
  readonly provider: string;
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly appleData: any;
}

export class AuthInfo {
  user: User;
  accessToken: string;
}
