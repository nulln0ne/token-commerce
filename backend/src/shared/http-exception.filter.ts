import { ExceptionFilter, Catch, ArgumentsHost, HttpException, UnauthorizedException, Logger } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let status = 500;
        let message: string | object = 'Internal server error';

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            message = exception.getResponse();
        }

        if (exception instanceof UnauthorizedException) {
            status = exception.getStatus();
            message = 'Unauthorized access - Please provide valid credentials';
            this.logger.warn(`Unauthorized access attempt: ${request.method} ${request.url}`);
        }

        this.logger.error(`Exception caught: ${request.method} ${request.url} - ${exception}`, exception instanceof Error ? exception.stack : '');

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            error: typeof message === 'string' ? message : (message as any).message || 'Internal server error',
        });
    }
}
