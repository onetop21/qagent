import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body } = request;
    const startTime = Date.now();

    this.logger.log(`Incoming ${method} ${url}`);

    return next.handle().pipe(
      tap({
        next: (data) => {
          const duration = Date.now() - startTime;
          this.logger.log(`Completed ${method} ${url} - ${duration}ms`);
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          this.logger.error(
            `Failed ${method} ${url} - ${duration}ms - ${error.message}`,
          );
        },
      }),
    );
  }
}
