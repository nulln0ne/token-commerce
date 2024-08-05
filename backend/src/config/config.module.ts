import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { TypeOrmConfigModule } from './database/typeorm.module';
import { RedisConfigModule } from './redis/redis.module';
import { JwtConfigModule } from './jwt/jwt.module';
import { Module } from '@nestjs/common';

@Module({
    imports: [
        NestConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        TypeOrmConfigModule,
        RedisConfigModule,
        JwtConfigModule,
    ],
})
export class ConfigModule {}
