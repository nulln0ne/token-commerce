import { IJwtConfig } from '../interfaces/jwt.config.interface';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import jwtConfig from './jwt.config';

@Module({
    imports: [ConfigModule.forFeature(jwtConfig)],
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
