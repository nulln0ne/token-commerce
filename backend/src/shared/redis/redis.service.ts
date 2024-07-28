import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
    private readonly logger = new Logger(RedisService.name);

    constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

    async get(key: string): Promise<string | null> {
        this.logger.log(`Getting value for key: ${key} from Redis`);
        try {
            const value = await this.redis.get(key);
            this.logger.log(`Value retrieved for key: ${key}`);
            return value;
        } catch (error) {
            this.logger.error(`Error getting value for key: ${key}`, error.stack);
            throw new InternalServerErrorException('Error fetching value from Redis');
        }
    }

    async set(key: string, value: string, ttl: number): Promise<void> {
        this.logger.log(`Setting value for key: ${key} in Redis with TTL: ${ttl}`);
        try {
            await this.redis.set(key, value, 'EX', ttl);
            this.logger.log(`Value set for key: ${key}`);
        } catch (error) {
            this.logger.error(`Error setting value for key: ${key}`, error.stack);
            throw new InternalServerErrorException('Error setting value in Redis');
        }
    }

    async del(key: string): Promise<void> {
        this.logger.log(`Deleting key: ${key} from Redis`);
        try {
            await this.redis.del(key);
            this.logger.log(`Key deleted: ${key}`);
        } catch (error) {
            this.logger.error(`Error deleting key: ${key}`, error.stack);
            throw new InternalServerErrorException('Error deleting key from Redis');
        }
    }

    async setToken(key: string, token: string, ttl: number): Promise<void> {
        this.logger.log(`Setting token with key: ${key}`);
        await this.set(key, token, ttl);
    }

    async getToken(key: string): Promise<boolean> {
        this.logger.log(`Checking token with key: ${key}`);
        const token = await this.get(key);
        return token !== null;
    }
}
