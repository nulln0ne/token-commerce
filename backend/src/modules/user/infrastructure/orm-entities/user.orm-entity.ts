import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    userId: string;

    @Column()
    walletAddress: string;

    @CreateDateColumn()
    createdAt: Date;
}
