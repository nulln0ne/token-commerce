import { Global, Module, forwardRef } from '@nestjs/common';
import { AuthController } from './presentation';
import { JwtRepository, NonceRepository } from './infrastructure';
import { AuthenticationService } from './application/services/authentication.service';
import { NonceService } from './application/services/nonce.service';
import { SignatureService } from './application/services/signature.service';
import { TokenService } from './application/services/token.service';
import { UserModule } from '../user/user.module'; 

@Global()
@Module({
  imports: [  UserModule], 
  controllers: [AuthController],
  providers: [
    AuthenticationService,  
    NonceService,
    SignatureService,
    TokenService,
    JwtRepository,
    NonceRepository,
  ],
  exports: [AuthenticationService, TokenService], 
})
export class AuthModule {}
