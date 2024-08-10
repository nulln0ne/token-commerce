import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtConfigService, RedisConfigService, configuration, dataSourceOptions, validate } from '@app/config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from '@nestjs-modules/ioredis';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import Redis from 'ioredis';

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
        }),
        RedisModule.forRootAsync({ useClass: RedisConfigService }),
        UserModule,
        AuthModule,
    ],
    providers: [
        JwtConfigService,
        RedisConfigService,
        {
            provide: 'REDIS_CLIENT',
            useFactory: (configService: ConfigService) => {
                const { url } = configService.get('redis');
                return new Redis(url);
            },
            inject: [ConfigService],
        },
    ],
    exports: [JwtConfigService, RedisConfigService, 'REDIS_CLIENT', JwtModule],
})
export class AppModule {}
