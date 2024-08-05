import { IErrorConfig } from '../interfaces/error.config.interface';
import { ConfigModule, ConfigService } from '@nestjs/config';
import errorConfig from './error.config';
import { Module } from '@nestjs/common';

@Module({
    imports: [ConfigModule.forFeature(errorConfig)],
    providers: [
        {
            provide: 'ERROR_CONFIG',
            useFactory: (configService: ConfigService): IErrorConfig => configService.get<IErrorConfig>('errors'),
            inject: [ConfigService],
        },
    ],
    exports: ['ERROR_CONFIG'],
})
export class ErrorConfigModule {}
