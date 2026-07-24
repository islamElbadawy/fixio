import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

const ERROR_CODES: Record<number, string> = {
  400: 'VALIDATION_ERROR',
  401: 'UNAUTHORIZED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  409: 'CONFLICT',
  422: 'DOMAIN_RULE_VIOLATION',
  500: 'INTERNAL_SERVER_ERROR',
};

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as any;

    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse?.message ?? exception.message);

    const details = Array.isArray(message) ? message : undefined;

    const singleMessage = Array.isArray(message)
      ? 'Validation failed — check error details'
      : message;

    response.status(status).json({
      success: false,
      error: {
        code: ERROR_CODES[status] ?? 'UNKNOWN_ERROR',
        message: singleMessage,
        statusCode: status,
        details,
      },
      timestamp: new Date().toISOString(),
    });
  }
}
