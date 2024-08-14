import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';
import { JwtConfig } from './jwt-config.type';

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
    constructor(private readonly configService: ConfigService<JwtConfig>) {}

    private getJwtConfig(type: 'jwtAccess' | 'jwtRefresh'): JwtModuleOptions {
        const config = this.configService.get<JwtConfig[typeof type]>(type);
        return {
            secret: config.secret,
            signOptions: {
                expiresIn: config.expirationTime,
            },
        };
    }

    public createJwtOptions(): JwtModuleOptions {
        return this.getJwtConfig('jwtAccess');
    }

    public getRefreshTokenConfig(): JwtModuleOptions {
        return this.getJwtConfig('jwtRefresh');
    }
}
