import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisModuleOptions, RedisModuleOptionsFactory } from '@nestjs-modules/ioredis';
import { Config } from '../configuration.type';

@Injectable()
export class RedisConfigService implements RedisModuleOptionsFactory { // RedisModuleOptionsFactory здесь правильно
    constructor(private readonly configService: ConfigService<Config>) {}

    public createRedisModuleOptions(): RedisModuleOptions | Promise<RedisModuleOptions> {
        const { url } = this.configService.get<Config['redis']>('redis');

        return { type: 'single', url };
    }
}
