import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './presentation/auth.controller';
import { JwtRepository } from './infrastructure/jwt.repository';
import { AuthService } from './application/auth.service';
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
    ],
    exports: [AuthService],
})
export class AuthModule {}
