import { Module } from '@nestjs/common';
import { BlockchainEthService } from './application/blockchain-eth.service';
import { BlockchainRepository } from './infrastructure/blockchain-eth.repository';

@Module({
  providers: [BlockchainEthService, BlockchainRepository],
  exports: [BlockchainEthService],
})
export class BlockchainEthModule {}
