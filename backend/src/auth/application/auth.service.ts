import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/application/user.service';
import { RedisRepository } from '../infrastructure/redis.repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    private readonly accessTokenTTL: string;
    private readonly refreshTokenTTL: string;

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly redisRepository: RedisRepository,
        private readonly configService: ConfigService,
    ) {
        this.accessTokenTTL = this.configService.get<string>('JWT_ACCESS_EXPIRATION_TIME');
        this.refreshTokenTTL = this.configService.get<string>('JWT_REFRESH_EXPIRATION_TIME');
    }

    async login(userId: string) {
        const payload = { sub: userId };
        const accessToken = this.jwtService.sign(payload, { expiresIn: this.accessTokenTTL });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: this.refreshTokenTTL });
        await this.redisRepository.saveRefreshToken(userId, refreshToken, Number(this.refreshTokenTTL));
        return { accessToken, refreshToken };
    }

    async refreshTokens(userId: string, refreshToken: string) {
        const storedRefreshToken = await this.redisRepository.getRefreshToken(userId);
        if (storedRefreshToken !== refreshToken) {
            throw new Error('Invalid refresh token');
        }

        const payload = { sub: userId };
        const newAccessToken = this.jwtService.sign(payload, { expiresIn: this.accessTokenTTL });
        const newRefreshToken = this.jwtService.sign(payload, { expiresIn: this.refreshTokenTTL });
        await this.redisRepository.saveRefreshToken(userId, newRefreshToken, Number(this.refreshTokenTTL));
        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }

    async logout(userId: string) {
        await this.redisRepository.deleteRefreshToken(userId);
    }
}
