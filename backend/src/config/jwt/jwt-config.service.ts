import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

import { JwtConfig } from './jwt-config.type';

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
    constructor(private readonly configService: ConfigService<JwtConfig>) {}

    public createJwtOptions(): JwtModuleOptions {
        const jwtAccess = this.configService.get<JwtConfig['jwtAccess']>('jwtAccess');

        return {
            secret: jwtAccess.secret,
            signOptions: {
                expiresIn: jwtAccess.expirationTime,
            },
        };
    }

    public getRefreshTokenConfig(): JwtModuleOptions {
        const jwtRefresh = this.configService.get<JwtConfig['jwtRefresh']>('jwtRefresh');

        return {
            secret: jwtRefresh.secret,
            signOptions: {
                expiresIn: jwtRefresh.expirationTime,
            },
        };
    }
}
