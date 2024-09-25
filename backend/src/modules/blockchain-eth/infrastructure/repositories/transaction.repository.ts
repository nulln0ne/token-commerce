import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionOrmEntity } from '../orm-entities/transactions.orm-entity';
import { UserOrmEntity } from 'src/modules/user/infrastructure';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectRepository(TransactionOrmEntity)
    private readonly transactionRepo: Repository<TransactionOrmEntity>,
    @InjectRepository(UserOrmEntity)
    private readonly userRepo: Repository<UserOrmEntity>,
  ) {}

  async saveTransaction(transactionData: Partial<TransactionOrmEntity>): Promise<TransactionOrmEntity> {
    const transaction = this.transactionRepo.create(transactionData);
    return await this.transactionRepo.save(transaction);
  }

  async findUserTransactions(walletAddress: string): Promise<UserOrmEntity | null> {
    return this.userRepo.findOne({
      where: { walletAddress: walletAddress.toLowerCase() },
      relations: ['transactions'], 
    });
  }
  

}
