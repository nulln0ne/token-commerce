import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './presentation';
import { JwtRepository } from './infrastructure/';
import { NonceRepository } from './infrastructure/';
import { AuthService } from './application';
import { UserModule } from 'src/modules/user/user.module';
import { JwtConfigService } from 'src/config/jwt/jwt-config.service';

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
