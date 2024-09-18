import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from '@nestjs-modules/ioredis';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtConfigService, RedisConfigService, configuration, validate, dataSourceOptions } from './config';
import { JwtConfigModule } from './config/jwt/jwt-congig.module';
import { RedisConfigModule } from './config/redis/redis-config.module';

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
        RedisConfigModule,
    ],

})
export class AppModule {}
