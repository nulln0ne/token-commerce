import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
    ForbiddenException,
  } from '@nestjs/common';
  import { TokenService } from 'src/modules/auth/application';
  import { Request } from 'express';
  import { JwtPayload } from 'src/modules/auth/infrastructure/entities/jwt/jwt-payload';
  
  @Injectable()
  export class JwtAccessGuard implements CanActivate {
    constructor(private readonly tokenService: TokenService) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request: Request = context.switchToHttp().getRequest();
      const token = request.cookies['accessToken'];
  
      if (!token) {
        throw new UnauthorizedException('Access token missing or invalid');
      }
  
      try {
        const decodedToken: JwtPayload = await this.tokenService.validateAccessToken(token);
        request.user = decodedToken;
        return true;
      } catch (err) {
        if (err.name === 'TokenExpiredError') {
          throw new ForbiddenException('Token has expired');
        }
        throw new UnauthorizedException('Invalid access token');
      }
    }
  }
  