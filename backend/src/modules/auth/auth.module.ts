import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './presentation';
import { JwtRepository, NonceRepository } from './infrastructure';
import { AuthenticationService } from './application/services/authentication.service';
import { NonceService } from './application/services/nonce.service';
import { JwtConfigService } from '../../config/jwt';
import { SignatureService } from './application/services/signature.service';
import { JwtAccessGuard } from './application';
import { TokenService } from './application/services/token.service';
import { UserModule } from '../user/user.module'; // Import UserModule to access UserService

@Module({
  imports: [
    forwardRef(() => UserModule), // Handle circular dependencies
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthenticationService,  // Make sure AuthService is provided
    NonceService,
    SignatureService,
    TokenService,
    JwtAccessGuard, 
    {
      provide: 'IJwtRepository',
      useClass: JwtRepository,
    },
    {
      provide: 'INonceRepository',
      useClass: NonceRepository,
    },
  ],
  exports: [AuthenticationService,TokenService, JwtAccessGuard], 
})
export class AuthModule {}
