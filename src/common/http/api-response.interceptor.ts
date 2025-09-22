import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map } from 'rxjs';
import { ApiResponse } from './api-response.types';
import { ok } from './api-response.util';
import { RAW_RESPONSE_KEY } from './skip-wrap.decorator';

@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const skipWrap = this.reflector.getAllAndOverride<boolean>(
      RAW_RESPONSE_KEY,
      [context.getHandler(), context.getClass()],
    );

    const req = context.switchToHttp().getRequest<Request & { path: string }>();
    const path = (req as any)?.originalUrl ?? (req as any)?.url;

    return next.handle().pipe(
      map((body) => {
        if (body && typeof body === 'object' && 'ok' in body) {
          (body as ApiResponse<any>).path ??= path;
          body.timestamp ??= new Date().toISOString();
          return body;
        }

        if (skipWrap) return body;

        const wrapped = ok(body);
        wrapped.path = path;
        return wrapped;
      }),
    );
  }
}
