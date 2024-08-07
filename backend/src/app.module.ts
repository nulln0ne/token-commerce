import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisConfigService, configuration, dataSourceOptions, validate } from '@app/config';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            ...dataSourceOptions,
            autoLoadEntities: true,
        }),
        ConfigModule.forRoot({
            isGlobal: true,
            load: configuration,
            validate,
        }),
        RedisModule.forRootAsync({ useClass: RedisConfigService }),
        UserModule,
        AuthModule,
    ],
})
export class AppModule {}
