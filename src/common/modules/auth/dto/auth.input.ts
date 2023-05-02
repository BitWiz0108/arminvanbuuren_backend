export class AuthInput {
  readonly username: string;
  readonly email: string;
  readonly password: string;
}

export class PasswordResetInputDto {
  readonly token: string;
  readonly password: string;
}

export class ForgotPasswordInputDto {
  readonly email: string;
}

export class VerifyEmailInputDto {
  readonly token: string;
}

export class ResendVerificationLinkInputDto {
  readonly email: string;
}