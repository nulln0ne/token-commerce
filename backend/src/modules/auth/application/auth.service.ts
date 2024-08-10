import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RedisRepository } from '../infrastructure/redis.repository';
import { AuthRepository } from '../infrastructure/auth.repository';
import { User } from 'src/modules/user/domain/user.entity';
import { JwtAccessToken, JwtRefreshToken } from '../domain/jwt.entity';
import { JwtConfigService } from 'src/config/jwt/jwt-config.service';
import { CreateUserDto } from 'src/modules/user/application/create-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly redisRepository: RedisRepository,
        private readonly authRepository: AuthRepository,
        private readonly jwtConfigService: JwtConfigService,
    ) {}

    private createJwtAccessToken(userId: string): JwtAccessToken {
        const payload = { sub: userId };
        const jwtConfig = this.jwtConfigService.createJwtOptions();

        const ttl = Number(jwtConfig.signOptions.expiresIn);
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: ttl,
            secret: jwtConfig.secret,
        });

        return {
            userId,
            accessToken,
            ttl,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    }

    private createJwtRefreshToken(userId: string): JwtRefreshToken {
        const payload = { sub: userId };
        const refreshTokenConfig = this.jwtConfigService.getRefreshTokenConfig();

        const ttl = Number(refreshTokenConfig.signOptions.expiresIn);
        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: ttl,
            secret: refreshTokenConfig.secret,
        });

        return {
            userId,
            refreshToken,
            ttl,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    }

    async login(userId: string) {
        const jwtAccessToken = this.createJwtAccessToken(userId);
        const jwtRefreshToken = this.createJwtRefreshToken(userId);

        await this.redisRepository.saveAccessToken(jwtAccessToken);
        await this.redisRepository.saveRefreshToken(jwtRefreshToken);

        return {
            accessToken: jwtAccessToken.accessToken,
            refreshToken: jwtRefreshToken.refreshToken,
        };
    }

    async refreshTokens(userId: string, refreshToken: string) {
        const storedRefreshToken = await this.redisRepository.getRefreshToken(userId);
        if (!storedRefreshToken || storedRefreshToken.refreshToken !== refreshToken) {
            throw new Error('Invalid refresh token');
        }

        const jwtAccessToken = this.createJwtAccessToken(userId);
        const jwtRefreshToken = this.createJwtRefreshToken(userId);

        await this.redisRepository.saveAccessToken(jwtAccessToken);
        await this.redisRepository.saveRefreshToken(jwtRefreshToken);

        return {
            accessToken: jwtAccessToken.accessToken,
            refreshToken: jwtRefreshToken.refreshToken,
        };
    }

    async logout(userId: string) {
        await this.redisRepository.deleteRefreshToken(userId);
        await this.redisRepository.deleteAccessToken(userId);
    }

    async createUser(dto: CreateUserDto): Promise<{ accessToken: string; refreshToken: string }> {
        let user = await this.authRepository.findOneByWalletAddress(dto.walletAddress);
        if (user) {
            const storedAccessToken = await this.redisRepository.getAccessToken(user.userId);
            const storedRefreshToken = await this.redisRepository.getRefreshToken(user.userId);

            if (storedAccessToken && storedRefreshToken) {
                return {
                    accessToken: storedAccessToken.accessToken,
                    refreshToken: storedRefreshToken.refreshToken,
                };
            }

            return this.login(user.userId);
        }

        user = new User();
        user.walletAddress = dto.walletAddress;
        user = await this.authRepository.saveUser(user);

        return this.login(user.userId);
    }

    async verifyToken(token: string): Promise<any> {
        const jwtConfig = this.jwtConfigService.createJwtOptions();
        return await this.jwtService.verifyAsync(token, { secret: jwtConfig.secret });
    }
}
