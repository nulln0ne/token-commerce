import { Injectable, Inject, InternalServerErrorException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { IJwtRepository, INonceRepository, JwtAccessTokenEntity, JwtRefreshTokenEntity } from '../../domain';
import { JwtService } from '@nestjs/jwt';
import { JwtConfigService } from '@app/config';
import { v4 as uuidv4 } from 'uuid';
import { ethers } from 'ethers';
import { UserService } from 'src/modules/user/application';
import { CreateUserDto } from 'src/modules/user/application';
import { NonceService } from './nonce.service';

@Injectable()
export class SignatureService {
  constructor(private readonly nonceService: NonceService) {}

  async verifySignature(walletAddress: string, signature: string): Promise<boolean> {
    const nonce = await this.nonceService.getNonce(walletAddress);
    if (!nonce) {
      throw new UnauthorizedException('Nonce not found or expired');
    }

    const nonceMessage = `Sign this nonce: ${nonce}`;

    try {
      const recoveredAddress = ethers.utils.verifyMessage(nonceMessage, signature);
      if (recoveredAddress.toLowerCase() === walletAddress.toLowerCase()) {
        await this.nonceService.removeNonce(walletAddress);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw new UnauthorizedException('Invalid signature');
    }
  }
}
