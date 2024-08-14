import { Injectable, InternalServerErrorException, Inject } from '@nestjs/common';
import { INonceRepository } from '../../domain/interfaces/nonce-repository.interface';
import { INonce } from '../../domain/entities/nonce/nonce-entity.interface';
import { NonceEntity } from '../../domain/entities/nonce/nonce.entity';
import Redis from 'ioredis';

@Injectable()
export class NonceRepository implements INonceRepository {
    private readonly redisClient: Redis;

    constructor(@Inject('REDIS_CLIENT') redisClient: Redis) {
        this.redisClient = redisClient;
    }

    async saveNonce(nonceEntity: INonce): Promise<void> {
        const createdAt = new Date();
        const entity = new NonceEntity(nonceEntity.walletAddress, nonceEntity.nonce);
        entity.createdAt = createdAt;

        try {
            await this.redisClient.set(`nonce:${nonceEntity.walletAddress}`, JSON.stringify(entity), 'EX', 60);
        } catch (error) {
            throw new InternalServerErrorException('Failed to save nonce');
        }
    }

    async findNonceByWalletAddress(walletAddress: string): Promise<INonce | null> {
        try {
            const result = await this.redisClient.get(`nonce:${walletAddress}`);
            if (!result) return null;

            const parsedResult = JSON.parse(result) as INonce;
            const entity = new NonceEntity(parsedResult.walletAddress, parsedResult.nonce);
            entity.createdAt = new Date(parsedResult.createdAt);

            return entity;
        } catch (error) {
            throw new InternalServerErrorException('Failed to find nonce');
        }
    }

    async deleteNonce(walletAddress: string): Promise<void> {
        try {
            await this.redisClient.del(`nonce:${walletAddress}`);
        } catch (error) {
            throw new InternalServerErrorException('Failed to delete nonce');
        }
    }
}
