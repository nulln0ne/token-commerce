import { RedisConfig } from './redis-config.type';

export const redisConfiguration = (): RedisConfig => {
    return {
        redis: {
            url: process.env.REDIS_URL,
        },
    };
};
