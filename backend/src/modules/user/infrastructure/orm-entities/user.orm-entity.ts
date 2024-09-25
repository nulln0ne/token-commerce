import { Column, OneToMany, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TransactionOrmEntity } from 'src/modules/blockchain-eth/infrastructure/orm-entities/transactions.orm-entity';   

@Entity('users')
export class UserOrmEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    walletAddress: string;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => TransactionOrmEntity, (transaction) => transaction.user)
    transactions: TransactionOrmEntity[];
}
