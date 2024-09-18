import { Module, Global } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';
import { RedisConfigService } from './redis-config.service';

@Global()
@Module({
    imports: [ RedisModule.forRootAsync({
        useClass: RedisConfigService,
    }),
],
    providers: [RedisConfigService],
    exports: [RedisModule],
})
export class RedisConfigModule {}
