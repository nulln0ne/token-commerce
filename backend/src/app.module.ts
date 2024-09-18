import { Module, Global, InternalServerErrorException } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from '@nestjs-modules/ioredis';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtConfigService, RedisConfigService, configuration, validate, dataSourceOptions } from './config';
import Redis from 'ioredis';
import { JwtConfigModule } from './config/jwt/jwt-congig.module';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: configuration,
            validate,
        }),
        TypeOrmModule.forRoot({
            ...dataSourceOptions,
            autoLoadEntities: true,
        }),
        JwtModule.registerAsync({
            useClass: JwtConfigService,
            global: true,
        }),
        RedisModule.forRootAsync({
            useClass: RedisConfigService,
        }),
        JwtConfigModule,
        UserModule,
        AuthModule,
    ],
    providers: [
        {
            provide: 'REDIS_CLIENT',
            useFactory: (configService: ConfigService) => {
                try {
                    const { url } = configService.get('redis');
                    if (!url) {
                        throw new InternalServerErrorException('Redis URL is not configured.');
                    }
                    return new Redis(url);
                } catch (error) {
                    throw new InternalServerErrorException('Failed to create Redis client');
                }
            },
            inject: [ConfigService],
        },
    ],
    exports: ['REDIS_CLIENT'],
})
export class AppModule {}
