import { RedisModule } from '@nestjs-modules/ioredis';
import { InternalServerErrorException, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Redis } from 'ioredis';
import { JwtConfigService, RedisConfigService, configuration, dataSourceOptions, validate } from './config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';

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
        }),
        RedisModule.forRootAsync({
            useClass: RedisConfigService,
        }),
        UserModule,
        AuthModule,
    ],
    providers: [
        JwtConfigService,
        RedisConfigService,
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
    exports: [JwtConfigService, RedisConfigService, 'REDIS_CLIENT', JwtModule],
})
export class AppModule {}
