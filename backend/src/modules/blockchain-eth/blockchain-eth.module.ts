import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockchainEthService } from './application/blockchain-eth.service';
import { BlockchainRepository } from './infrastructure/repositories/blockchain-eth.repository';
import { TransactionOrmEntity } from './infrastructure/orm-entities/transactions.orm-entity';
import { UserOrmEntity } from '../user/infrastructure';
import { TransactionRepository } from './infrastructure/repositories/transaction.repository';
@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionOrmEntity, UserOrmEntity],),  
  ],
  providers: [BlockchainEthService, BlockchainRepository,TransactionRepository],
  exports: [BlockchainEthService],
})
export class BlockchainEthModule {}
