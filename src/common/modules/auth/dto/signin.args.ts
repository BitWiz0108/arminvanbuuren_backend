import { User } from "@models/user.entity";

export class SigninArgs {
  readonly username: string;
  readonly password: string;
  readonly provider: string;
  readonly access_token: string;
  readonly refresh_token: string;
}

export class AuthInfo {
  user: User;
  accessToken: string;
}
