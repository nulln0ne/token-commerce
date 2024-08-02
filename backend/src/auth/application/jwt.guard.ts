import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private jwtService: JwtService) {
        super();
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            throw new UnauthorizedException('Missing access token');
        }
        try {
            const user = this.jwtService.verify(token);
            req.user = user;
            return super.canActivate(context);
        } catch (error) {
            throw new UnauthorizedException('Invalid access token');
        }
    }
}
