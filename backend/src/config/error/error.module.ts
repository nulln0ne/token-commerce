import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IErrorConfig } from '../interfaces/error.config.interface';

@Module({
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
