import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
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
  amountSent: string;

  @Column('decimal', { precision: 40, scale: 18 })
  amountReceived: string; 

  @Column('decimal', { precision: 40, scale: 18, nullable: true })
  fees: string; 

  @Column({ type: 'enum', enum: ['Success', 'Failed'], default: 'Success' })
  status: string; 

  @CreateDateColumn({ type: 'timestamp' })
  timestamp: Date; 

  @ManyToOne(() => UserOrmEntity, (user) => user.transactions, { nullable: true })
  user?: UserOrmEntity;
}
