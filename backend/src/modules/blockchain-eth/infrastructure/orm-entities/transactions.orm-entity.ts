import { Entity, Column,ManyToOne, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { UserOrmEntity } from 'src/modules/user/infrastructure';

@Entity('transactions')
export class TransactionOrmEntity {
    @PrimaryGeneratedColumn()
    id: number;  

    @Column({ unique: true })
    hash: string;  

    @Column()
    from: string;  

    @Column()
    to: string;  

    @Column('decimal', { precision: 40, scale: 18 })
    value: string;  

    @Column()
    timestamp: number;  

    @ManyToOne(() => UserOrmEntity, (user) => user.transactions, { nullable: true })
    user?: UserOrmEntity;  
}
