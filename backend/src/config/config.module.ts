import { Module } from '@nestjs/common';
import { DatabaseConfig } from './db.config';
import { JwtConfig } from './jwt.config';
import { RedisConfig } from './redis.config';

@Module({
    providers: [DatabaseConfig, JwtConfig, RedisConfig],
    exports: [DatabaseConfig, JwtConfig, RedisConfig],
})
export class ConfigModule {}
