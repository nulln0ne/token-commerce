import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BeforeInsert,
    BeforeUpdate,
} from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    walletAddress: string;

    @CreateDateColumn()
    createdOn: Date;

    @UpdateDateColumn()
    updatedOn: Date;

    @BeforeInsert()
    setCreationDate() {
        this.createdOn = new Date();
    }

    @BeforeUpdate()
    setUpdateDate() {
        this.updatedOn = new Date();
    }
}
