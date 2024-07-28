import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(LoggingInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const method = request.method;
        const url = request.url;

        this.logger.log(`Incoming request: ${method} ${url}`);

        return next.handle().pipe(
            tap({
                next: (data) => this.logger.log(`Response: ${method} ${url} - ${JSON.stringify(data)}`),
                error: (error) => this.logger.error(`Error: ${method} ${url} - ${error.message}`, error.stack),
            }),
        );
    }
}
