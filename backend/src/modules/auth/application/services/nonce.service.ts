import { Injectable,UnauthorizedException } from '@nestjs/common';
import {  NonceRepository } from '../../infrastructure';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class NonceService {
  constructor(
    private readonly nonceRepository: NonceRepository,
  ) {}

  async generateNonce(walletAddress: string, refreshToken?: string): Promise<string> {
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
