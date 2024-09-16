import { Injectable, Inject, InternalServerErrorException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { IJwtRepository, INonceRepository, JwtAccessTokenEntity, JwtRefreshTokenEntity } from '../../domain';
import { JwtService } from '@nestjs/jwt';
import { JwtConfigService } from '@app/config';
import { v4 as uuidv4 } from 'uuid';
import { ethers } from 'ethers';
import { UserService } from 'src/modules/user/application';
import { CreateUserDto } from 'src/modules/user/application';


@Injectable()
export class NonceService {
  constructor(
    @Inject('INonceRepository')
    private readonly nonceRepository: INonceRepository,
  ) {}

  async generateNonce(walletAddress: string): Promise<string> {
    const nonce = uuidv4();
    const nonceEntity = { walletAddress, nonce, createdAt: new Date() };
    await this.nonceRepository.saveNonce(nonceEntity);
    return nonce;
  }

  async getNonce(walletAddress: string): Promise<string> {
    const nonceEntity = await this.nonceRepository.findNonceByWalletAddress(walletAddress);
    return nonceEntity?.nonce;
  }

  async removeNonce(walletAddress: string): Promise<void> {
    await this.nonceRepository.removeNonce(walletAddress);
  }
}
