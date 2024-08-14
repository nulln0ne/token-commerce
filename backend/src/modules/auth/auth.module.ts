import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './presentation';
import { JwtRepository, NonceRepository } from './infrastructure';
import { AuthService } from './application';
import { JwtConfigService } from '../../config/jwt';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        forwardRef(() => UserModule),
        JwtModule.registerAsync({
            useClass: JwtConfigService,
        }),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        {
            provide: 'IJwtRepository',
            useClass: JwtRepository,
        },
        {
            provide: 'INonceRepository',
            useClass: NonceRepository,
        },
    ],
    exports: [AuthService],
})
export class AuthModule {}
