import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Reflector } from '@nestjs/core';
import { PARSE_REQUEST_BODY_WHEN_LOGGING_KEY } from './parseRequestBodyWhenLogging';
import { plainToInstance } from 'class-transformer';
import { Constructor } from 'type-fest';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  private readonly logger = new Logger('HTTP');

  private parseRequestBody(context: ExecutionContext) {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const body: unknown = request.body;
    if (!body) {
      return;
    }
    if (body === null || typeof body !== 'object') {
      return body;
    }
    const requestBodyDto = this.reflector.getAllAndOverride<
      Constructor<unknown>
    >(PARSE_REQUEST_BODY_WHEN_LOGGING_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requestBodyDto) {
      return body;
    }
    const instance = plainToInstance(requestBodyDto, body);
    return JSON.stringify(instance);
  }

  intercept(context: ExecutionContext, next: CallHandler) {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<Response>();

    response.on('finish', () => {
      const { method, originalUrl } = request;
      const { statusCode, statusMessage } = response;

      const message = `${method} ${originalUrl} ${statusCode} ${statusMessage} Request body: ${this.parseRequestBody(
        context,
      )}`;

      if (statusCode >= 500) {
        return this.logger.error(message);
      }

      if (statusCode >= 400) {
        return this.logger.warn(message);
      }

      return this.logger.log(message);
    });

    return next.handle();
  }
}
