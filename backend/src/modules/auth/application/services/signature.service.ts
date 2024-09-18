import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ethers } from 'ethers';
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
