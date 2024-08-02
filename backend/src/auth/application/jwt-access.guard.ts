import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Injectable()
export class JwtAccessGuard implements CanActivate {
    constructor(private readonly authService: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            throw new UnauthorizedException('Authorization header missing');
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException('Token missing');
        }

        try {
            const decoded = await this.authService.verifyToken(token);
            request['user'] = decoded;
            return true;
        } catch (err) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}
