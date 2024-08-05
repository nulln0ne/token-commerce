import { IJwtConfig } from '../../../config/interfaces/jwt.config.interface';
import { CreateUserDto } from 'src/modules/user/application/create-user.dto';
import { IErrorConfig } from 'src/config/interfaces/error.config.interface';
import { RedisRepository } from '../infrastructure/redis.repository';
import { AuthRepository } from '../infrastructure/auth.repository';
import { User } from 'src/modules/user/domain/user.entity';
import {
    Injectable,
    Inject,
    ConflictException,
    InternalServerErrorException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtAccessToken, JwtRefreshToken } from '../domain/jwt.entity';

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

    private createJwtAccessToken(userId: string): JwtAccessToken {
        const payload = { sub: userId };
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: this.accessTokenTTL,
            secret: this.accessSecret,
        });

        return {
            userId,
            accessToken,
            ttl: this.accessTokenTTL,
            jwtSecret: this.accessSecret,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    }

    private createJwtRefreshToken(userId: string): JwtRefreshToken {
        const payload = { sub: userId };
        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: this.refreshTokenTTL,
            secret: this.refreshSecret,
        });

        return {
            userId,
            refreshToken,
            ttl: this.refreshTokenTTL,
            jwtSecret: this.refreshSecret,
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
            throw new Error(this.errorConfig.INVALID_REFRESH_TOKEN);
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
    }

    async createUser(dto: CreateUserDto): Promise<{ accessToken: string; refreshToken: string }> {
        let user = await this.authRepository.findOneByWalletAddress(dto.walletAddress);
        if (user) {
            throw new ConflictException(this.errorConfig.USER_ALREADY_EXISTS);
        }

        try {
            user = new User();
            user.walletAddress = dto.walletAddress;
            user = await this.authRepository.saveUser(user);
        } catch (error) {
            throw new InternalServerErrorException(this.errorConfig.DATABASE_CONNECTION_ERROR);
        }

        return this.login(user.id);
    }

    async verifyToken(token: string): Promise<any> {
        try {
            return await this.jwtService.verifyAsync(token, { secret: this.accessSecret });
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new UnauthorizedException(this.errorConfig.TOKEN_EXPIRED);
            } else if (error.name === 'JsonWebTokenError') {
                throw new UnauthorizedException(this.errorConfig.INVALID_ACCESS_TOKEN);
            } else {
                throw new UnauthorizedException(this.errorConfig.FAILED_TO_VERIFY_ACCESS_TOKEN);
            }
        }
    }
}
