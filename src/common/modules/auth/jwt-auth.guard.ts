import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (
      request.path === `/${process.env.API_VERSION}/auth/forgot-password` ||
      request.path === `/${process.env.API_VERSION}/auth/reset-password` ||
      request.path === `/${process.env.API_VERSION}/auth/verify-email` ||
      request.path === `/${process.env.API_VERSION}/auth/resend-verification-link` ||
      request.path === `/${process.env.API_VERSION}/auth/servertime` ||
      request.path === `/${process.env.API_VERSION}/auth/signin` ||
      request.path === `/${process.env.API_VERSION}/auth/signup` ||
      request.path === `/${process.env.API_VERSION}/fanclub/artist` ||
      request.path === `/${process.env.API_VERSION}/termsofservice` ||
      request.path === `/${process.env.API_VERSION}/home` ||
      request.path === `/${process.env.API_VERSION}/admin/login-background` ||
      ( request.path === `/${process.env.API_VERSION}/admin/oauth` && request.method === 'GET' )
    ) {
      return true;
    }

    const user = request.user;

    if (user && (user.status == false || user.status == null || user.emailVerifiedAt == null)) {
      return false;
    }
    return super.canActivate(context);
  }

  handleRequest(err, user) {
    if (err || !user || !user.id) {
      throw err || new ForbiddenException('Forbidden resource');
    }
    return user;
  }
}