import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { DomainException } from '../../domain/exceptions/domain.exception';

interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    statusCode: number;
    details?: unknown;
  };
  timestamp: string;
}

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const body: ErrorResponse = {
      success: false,
      error: {
        code: 'DOMAIN_RULE_VIOLATION',
        message: exception.message,
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      },
      timestamp: new Date().toISOString(),
    };

    response.status(HttpStatus.UNPROCESSABLE_ENTITY).json(body);
  }
}
