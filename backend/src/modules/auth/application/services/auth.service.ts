import { Injectable, Inject, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { IJwtRepository } from '../../domain';
import { INonceRepository } from '../../domain';
import { JwtService } from '@nestjs/jwt';
import { JwtConfigService } from '@app/config';
import { JwtAccessTokenEntity, JwtRefreshTokenEntity } from '../../domain/';
import { NonceEntity } from '../../domain/';
import { v4 as uuidv4 } from 'uuid';
import { ethers } from 'ethers';

@Injectable()
export class AuthService {
    constructor(
        @Inject('IJwtRepository')
        private readonly jwtRepository: IJwtRepository,
        @Inject('INonceRepository')
        private readonly nonceRepository: INonceRepository,
        private readonly jwtService: JwtService,
        private readonly jwtConfigService: JwtConfigService,
    ) {}

    private generateAccessToken(userId: string): JwtAccessTokenEntity {
        try {
            const payload = { sub: userId };
            const jwtConfig = this.jwtConfigService.createJwtOptions();
            const ttl = Number(jwtConfig.signOptions.expiresIn);
            const accessToken = this.jwtService.sign(payload, {
                expiresIn: ttl,
                secret: jwtConfig.secret,
            });

            return new JwtAccessTokenEntity(userId, ttl, new Date(), new Date(), accessToken);
        } catch (error) {
            throw new InternalServerErrorException('Failed to generate access token');
        }
    }

    private generateRefreshToken(userId: string): JwtRefreshTokenEntity {
        try {
            const payload = { sub: userId };
            const refreshTokenConfig = this.jwtConfigService.getRefreshTokenConfig();
            const ttl = Number(refreshTokenConfig.signOptions.expiresIn);
            const refreshToken = this.jwtService.sign(payload, {
                expiresIn: ttl,
                secret: refreshTokenConfig.secret,
            });

            return new JwtRefreshTokenEntity(userId, ttl, new Date(), new Date(), refreshToken);
        } catch (error) {
            throw new InternalServerErrorException('Failed to generate refresh token');
        }
    }

    async generateNonce(userId: string): Promise<string> {
        const nonce = uuidv4();
        const nonceEntity = new NonceEntity(userId, nonce);
        await this.nonceRepository.saveNonce(nonceEntity);
        return nonce;
    }

    async verifySignature(userId: string, signature: string, publicAddress: string): Promise<boolean> {
        const nonceEntity = await this.nonceRepository.findNonceByUserId(userId);
        if (!nonceEntity) {
            throw new UnauthorizedException('Nonce not found or expired');
        }

        try {
            const recoveredAddress = ethers.utils.verifyMessage(nonceEntity.nonce, signature);
            if (recoveredAddress.toLowerCase() === publicAddress.toLowerCase()) {
                await this.nonceRepository.deleteNonce(userId);
                return true;
            } else {
                return false;
            }
        } catch (error) {
            throw new UnauthorizedException('Invalid signature');
        }
    }

    async loginUser(userId: string) {
        try {
            await this.logoutUser(userId);

            const accessTokenEntity = this.generateAccessToken(userId);
            const refreshTokenEntity = this.generateRefreshToken(userId);

            await this.jwtRepository.saveAccessToken(accessTokenEntity);
            await this.jwtRepository.saveRefreshToken(refreshTokenEntity);

            return {
                accessToken: accessTokenEntity.accessToken,
                refreshToken: refreshTokenEntity.refreshToken,
            };
        } catch (error) {
            throw new InternalServerErrorException('Login failed');
        }
    }

    async logoutUser(userId: string) {
        try {
            const accessTokens = await this.jwtRepository.findAccessTokensByUserId(userId);
            const refreshTokens = await this.jwtRepository.findRefreshTokensByUserId(userId);

            await Promise.all([
                ...accessTokens.map((token) => this.jwtRepository.removeAccessToken(token.accessToken)),
                ...refreshTokens.map((token) => this.jwtRepository.removeRefreshToken(token.refreshToken)),
            ]);
        } catch (error) {
            throw new InternalServerErrorException('Logout failed');
        }
    }

    async validateToken(token: string): Promise<any> {
        try {
            return await this.jwtService.verifyAsync(token);
        } catch (err) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}
