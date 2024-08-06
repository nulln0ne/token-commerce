import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from './config/config.module';
import { Module } from '@nestjs/common';

@Module({
    imports: [ConfigModule, UserModule, AuthModule],
})
export class AppModule {}
