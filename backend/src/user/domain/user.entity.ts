import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
    @ApiProperty({ description: 'The unique identifier of the user', example: 'a3f5e27d-df50-4c5e-8bfa-1d2cdfe7f7f0' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'The wallet address of the user', example: '0x123456789abcdef' })
    @Column({ unique: true })
    walletAddress: string;

    @ApiProperty({ description: 'The date the user was created', example: '2023-07-28T12:34:56.789Z' })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({ description: 'The date the user was last updated', example: '2023-07-29T12:34:56.789Z' })
    @UpdateDateColumn()
    updatedAt: Date;
}
