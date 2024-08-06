import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IJwtConfig } from '../interfaces/jwt.config.interface';

@Module({
    providers: [
        {
            provide: 'JWT_CONFIG',
            useFactory: (configService: ConfigService): IJwtConfig => configService.get<IJwtConfig>('jwt'),
            inject: [ConfigService],
        },
    ],
    exports: ['JWT_CONFIG'],
})
export class JwtConfigModule {}
