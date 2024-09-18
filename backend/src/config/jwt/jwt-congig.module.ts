import { Module, Global } from '@nestjs/common';
import { JwtConfigService } from './jwt-config.service';

@Global()
@Module({
    providers: [JwtConfigService],
    exports: [JwtConfigService],
})
export class JwtConfigModule {}
