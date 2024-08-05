import { IJwtConfig } from '../../../config/interfaces/jwt.config.interface';
import { CreateUserDto } from 'src/modules/user/application/create-user.dto';
import { IErrorConfig } from 'src/config/interfaces/error.config.interface';
import { RedisRepository } from '../infrastructure/redis.repository';
import { AuthRepository } from '../infrastructure/auth.repository';
import { User } from 'src/modules/user/domain/user.entity';
import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    private readonly accessTokenTTL: number;
    private readonly refreshTokenTTL: number;
    private readonly accessSecret: string;
    private readonly refreshSecret: string;

    constructor(
        private readonly jwtService: JwtService,
        private readonly redisRepository: RedisRepository,
        private readonly authRepository: AuthRepository,
        @Inject('JWT_CONFIG') jwtConfig: IJwtConfig,
        @Inject('ERROR_CONFIG') private readonly errorConfig: IErrorConfig,
    ) {
        this.accessTokenTTL = parseInt(jwtConfig.accessExpirationTime, 10);
        this.refreshTokenTTL = parseInt(jwtConfig.refreshExpirationTime, 10);
        this.accessSecret = jwtConfig.accessSecret;
        this.refreshSecret = jwtConfig.refreshSecret;
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
        await this.redisRepository.saveRefreshToken(userId, refreshToken, this.refreshTokenTTL);
        return { accessToken, refreshToken };
    }

    async refreshTokens(userId: string, refreshToken: string) {
        const storedRefreshToken = await this.redisRepository.getRefreshToken(userId);
        if (storedRefreshToken !== refreshToken) {
            throw new Error(this.errorConfig.INVALID_REFRESH_TOKEN);
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
        await this.redisRepository.saveRefreshToken(userId, newRefreshToken, this.refreshTokenTTL);
        await this.redisRepository.saveAccessToken(userId, newAccessToken, this.accessTokenTTL);
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
        return this.jwtService.verifyAsync(token, { secret: this.accessSecret });
    }
}
