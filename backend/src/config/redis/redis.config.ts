import { IRedisConfig } from '../interfaces/redis.config.interface';
import { registerAs } from '@nestjs/config';

export default registerAs(
    'redis',
    (): IRedisConfig => ({
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT, 10),
    }),
);
