import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from '../infrastructure/auth.repository';
import { RedisRepository } from '../infrastructure/redis.repository';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from 'src/user/application/create-user.dto';
import { User } from 'src/user/domain/user.entity';

@Injectable()
export class AuthService {
    private readonly accessTokenTTL: string;
    private readonly refreshTokenTTL: string;
    private readonly accessSecret: string;
    private readonly refreshSecret: string;

    constructor(
        private readonly jwtService: JwtService,
        private readonly redisRepository: RedisRepository,
        private readonly configService: ConfigService,
        private readonly authRepository: AuthRepository,
    ) {
        this.accessTokenTTL = this.configService.get<string>('JWT_ACCESS_EXPIRATION_TIME');
        this.refreshTokenTTL = this.configService.get<string>('JWT_REFRESH_EXPIRATION_TIME');
        this.accessSecret = this.configService.get<string>('JWT_ACCESS_SECRET');
        this.refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
    }

    async login(userId: string) {
        const payload = { sub: userId };
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: this.accessTokenTTL,
            secret: this.accessSecret,
        });
        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: this.refreshTokenTTL,
            secret: this.refreshSecret,
        });
        await this.redisRepository.saveRefreshToken(userId, refreshToken, Number(this.refreshTokenTTL));
        return { accessToken, refreshToken };
    }

    async refreshTokens(userId: string, refreshToken: string) {
        const storedRefreshToken = await this.redisRepository.getRefreshToken(userId);
        if (storedRefreshToken !== refreshToken) {
            throw new Error('Invalid refresh token');
        }

        const payload = { sub: userId };
        const newAccessToken = this.jwtService.sign(payload, {
            expiresIn: this.accessTokenTTL,
            secret: this.accessSecret,
        });
        const newRefreshToken = this.jwtService.sign(payload, {
            expiresIn: this.refreshTokenTTL,
            secret: this.refreshSecret,
        });
        await this.redisRepository.saveRefreshToken(userId, newRefreshToken, Number(this.refreshTokenTTL));
        await this.redisRepository.saveAccessToken(userId, newAccessToken, Number(this.accessTokenTTL));
        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }

    async logout(userId: string) {
        await this.redisRepository.deleteRefreshToken(userId);
    }

    async createUser(dto: CreateUserDto): Promise<{ accessToken: string; refreshToken: string }> {
        let user = await this.authRepository.findOneByWalletAddress(dto.walletAddress);
        if (!user) {
            user = new User();
            user.walletAddress = dto.walletAddress;
            user = await this.authRepository.saveUser(user);
        }
        return this.login(user.id);
    }

    async verifyToken(token: string): Promise<any> {
        console.log(token);
        console.log(this.accessSecret);
        this.jwtService.verifyAsync(token, { secret: this.accessSecret });
    }
}
