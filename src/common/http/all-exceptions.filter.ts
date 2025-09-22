import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { err } from './api-response.util';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const isHttp = exception instanceof HttpException;
    const status = isHttp
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Unexpected error';
    let errorName = isHttp ? exception.name : 'InternalError';
    let details: any;

    if (isHttp) {
      const resp = exception.getResponse();
      if (typeof resp === 'string') {
        message = resp;
      } else if (resp && typeof resp === 'object') {
        const r: any = resp;
        message = r.message ?? r.error ?? JSON.stringify(r);
        errorName = r.error ?? errorName;
        details = r.message && Array.isArray(r.message) ? r.message : undefined;
      }
    } else if (exception instanceof Error) {
      message = exception.message || message;
    }

    const payload = err(status, message, errorName, details);
    (payload as any).path = req.originalUrl || req.url;

    res.status(status).json(payload);
  }
}
