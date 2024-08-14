import { Injectable, InternalServerErrorException, Inject } from '@nestjs/common';
import { INonceRepository } from '../../domain/interfaces/nonce-repository.interface';
import { INonce } from '../../domain/entities/nonce/nonce-entity.interface';
import Redis from 'ioredis';

@Injectable()
export class NonceRepository implements INonceRepository {
    private readonly redisClient: Redis;

    constructor(@Inject('REDIS_CLIENT') redisClient: Redis) {
        this.redisClient = redisClient;
    }

    async saveNonce(nonceEntity: INonce): Promise<void> {
        const key = `nonce:${nonceEntity.walletAddress}`;
        try {
            console.log(`Attempting to save nonce: ${key} -> ${nonceEntity.nonce}`);
            await this.redisClient.set(key, nonceEntity.nonce, 'EX', 60);
            console.log(`Nonce saved in Redis: ${key} -> ${nonceEntity.nonce}`);
        } catch (error) {
            console.error('Failed to save nonce in Redis:', error);
            throw new InternalServerErrorException('Failed to save nonce');
        }
    }

    async findNonceByWalletAddress(walletAddress: string): Promise<INonce | null> {
        try {
            const key = `nonce:${walletAddress}`;
            const nonce = await this.redisClient.get(key);
            if (!nonce) return null;

            return { walletAddress, nonce, createdAt: new Date() };
        } catch (error) {
            throw new InternalServerErrorException('Failed to find nonce');
        }
    }

    async removeNonce(walletAddress: string): Promise<void> {
        try {
            const key = `nonce:${walletAddress}`;
            await this.redisClient.del(key);
        } catch (error) {
            throw new InternalServerErrorException('Failed to delete nonce');
        }
    }
}
