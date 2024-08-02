import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtConfig {
    constructor(private configService: ConfigService) {}

    public getJwtAccessConfig() {
        return {
            secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
            signOptions: {
                expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION_TIME'),
            },
        };
    }

    public getRefreshJwtConfig() {
        return {
            secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            signOptions: {
                expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION_TIME'),
            },
        };
    }
}
