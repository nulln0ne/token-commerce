import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { Request } from 'express';

@Injectable()
export class JwtAccessGuard implements CanActivate {
    constructor(private readonly authService: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('Access token missing or invalid');
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException('Access token missing or invalid');
        }

        try {
            const decodedToken = await this.authService.validateToken(token);
            request['user'] = decodedToken;
            return true;
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                throw new ForbiddenException('Token has expired');
            }
            throw new UnauthorizedException('Invalid access token');
        }
    }
}
