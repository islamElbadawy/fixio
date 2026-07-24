import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../response/api-response';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((data) => {
        // Already wrapped — don't double-wrap
        if (data instanceof ApiResponse) return data;

        // null means 204 No Content
        if (data === null || data === undefined) {
          return ApiResponse.noContent();
        }

        // Array — wrap as list with count
        if (Array.isArray(data)) {
          return ApiResponse.list(data);
        }

        // Single object
        return ApiResponse.ok(data);
      }),
    );
  }
}
