import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    userId: string;

    @Column()
    walletAddress: string;

    @CreateDateColumn()
    createdAt: Date;
}
