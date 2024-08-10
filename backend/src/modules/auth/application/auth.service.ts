import { Injectable, Inject, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { IJwtRepository } from '../domain';
import { JwtService } from '@nestjs/jwt';
import { JwtConfigService } from 'src/config/jwt/jwt-config.service';
import { JwtAccessToken, JwtRefreshToken } from '../domain';

@Injectable()
export class AuthService {
    constructor(
        @Inject('IJwtRepository')
        private readonly jwtRepository: IJwtRepository,
        private readonly jwtService: JwtService,
        private readonly jwtConfigService: JwtConfigService,
    ) {}

    private createJwtAccessToken(userId: string): JwtAccessToken {
        try {
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
        } catch (error) {
            throw new InternalServerErrorException('Failed to create JWT access token');
        }
    }

    private createJwtRefreshToken(userId: string): JwtRefreshToken {
        try {
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
        } catch (error) {
            throw new InternalServerErrorException('Failed to create JWT refresh token');
        }
    }

    async login(userId: string) {
        try {
            const jwtAccessToken = this.createJwtAccessToken(userId);
            const jwtRefreshToken = this.createJwtRefreshToken(userId);

            await this.jwtRepository.saveAccessToken(jwtAccessToken);
            await this.jwtRepository.saveRefreshToken(jwtRefreshToken);

            return {
                accessToken: jwtAccessToken.accessToken,
                refreshToken: jwtRefreshToken.refreshToken,
            };
        } catch (error) {
            throw new InternalServerErrorException('Login failed');
        }
    }

    async logout(userId: string) {
        try {
            await this.jwtRepository.deleteAccessToken(userId);
            await this.jwtRepository.deleteRefreshToken(userId);
        } catch (error) {
            throw new InternalServerErrorException('Logout failed');
        }
    }

    async refreshTokens(userId: string, refreshToken: string) {
        try {
            const storedRefreshToken = await this.jwtRepository.findRefreshToken(refreshToken);
            if (!storedRefreshToken || storedRefreshToken.refreshToken !== refreshToken) {
                throw new UnauthorizedException('Invalid refresh token');
            }

            const jwtAccessToken = this.createJwtAccessToken(userId);
            const jwtRefreshToken = this.createJwtRefreshToken(userId);

            await this.jwtRepository.saveAccessToken(jwtAccessToken);
            await this.jwtRepository.saveRefreshToken(jwtRefreshToken);

            return {
                accessToken: jwtAccessToken.accessToken,
                refreshToken: jwtRefreshToken.refreshToken,
            };
        } catch (error) {
            throw new InternalServerErrorException('Token refresh failed');
        }
    }

    async verifyToken(token: string): Promise<any> {
        try {
            return await this.jwtService.verifyAsync(token);
        } catch (err) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}
