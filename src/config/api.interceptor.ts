import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import config from '@config/app.config';

@Injectable()
export class ApiInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    request.url = `${config[process.env.NODE_ENV].base_url + config[process.env.NODE_ENV].version}${request.url}`;
    return next.handle();
  }
}