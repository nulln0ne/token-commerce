import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Inject } from '@nestjs/common';
import { IErrorConfig } from 'src/config/interfaces/error.config.interface';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Injectable()
export class JwtAccessGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService,
        @Inject('ERROR_CONFIG') private readonly errorConfig: IErrorConfig,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException(this.errorConfig.INVALID_ACCESS_TOKEN);
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException(this.errorConfig.INVALID_ACCESS_TOKEN);
        }

        try {
            const decoded = await this.authService.verifyToken(token);
            request['user'] = decoded;
            return true;
        } catch (err) {
            throw new UnauthorizedException(this.errorConfig.INVALID_ACCESS_TOKEN);
        }
    }
}
