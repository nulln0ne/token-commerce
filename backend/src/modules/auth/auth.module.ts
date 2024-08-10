import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './presentation/auth.controller';
import { AuthRepository } from './infrastructure/auth.repository';
import { AuthService } from './application/auth.service';
import { RedisRepository } from './infrastructure/redis.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/user/domain/user.entity';
import { UserModule } from 'src/modules/user/user.module';

@Module({
    imports: [forwardRef(() => UserModule), TypeOrmModule.forFeature([User])],
    controllers: [AuthController],
    providers: [AuthService, RedisRepository, AuthRepository],
    exports: [AuthService, RedisRepository, AuthRepository],
})
export class AuthModule {}
