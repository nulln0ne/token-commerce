import {
    Injectable,
    Inject,
    InternalServerErrorException,
    UnauthorizedException,
    ForbiddenException,
} from '@nestjs/common';
import { IJwtRepository, INonceRepository, JwtAccessTokenEntity, JwtRefreshTokenEntity } from '../../domain';
import { JwtService } from '@nestjs/jwt';
import { JwtConfigService } from '@app/config';
import { v4 as uuidv4 } from 'uuid';
import { ethers } from 'ethers';
import { UserService } from 'src/modules/user/application';
import { CreateUserDto } from 'src/modules/user/application';
import { NonceEntity } from '../../domain';

@Injectable()
export class AuthService {
    constructor(
        @Inject('IJwtRepository')
        private readonly jwtRepository: IJwtRepository,
        @Inject('INonceRepository')
        private readonly nonceRepository: INonceRepository,
        private readonly jwtService: JwtService,
        private readonly jwtConfigService: JwtConfigService,
        private readonly userService: UserService,
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

            return new JwtAccessTokenEntity(userId, ttl, accessToken);
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

            return new JwtRefreshTokenEntity(userId, ttl, refreshToken);
        } catch (error) {
            throw new InternalServerErrorException('Failed to generate refresh token');
        }
    }

    async generateNonce(walletAddress: string): Promise<string> {
        const nonce = uuidv4();
        const nonceEntity = new NonceEntity(walletAddress, nonce);
        await this.nonceRepository.saveNonce(nonceEntity);
        return nonce;
    }

    async verifySignature(walletAddress: string, signature: string): Promise<boolean> {
        const nonceEntity = await this.nonceRepository.findNonceByWalletAddress(walletAddress);
        if (!nonceEntity) {
            throw new UnauthorizedException('Nonce not found or expired');
        }

        try {
            const recoveredAddress = ethers.utils.verifyMessage(nonceEntity.nonce, signature);
            if (recoveredAddress.toLowerCase() === walletAddress.toLowerCase()) {
                await this.nonceRepository.deleteNonce(walletAddress);
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

    async authenticateUser(createUserDto: CreateUserDto, signature: string) {
        const { walletAddress } = createUserDto;

        const isVerified = await this.verifySignature(walletAddress, signature);
        if (!isVerified) {
            throw new UnauthorizedException('Signature verification failed');
        }

        let user = await this.userService.findUserByWalletAddress(walletAddress);

        if (!user) {
            user = await this.userService.createUser(createUserDto);
        }

        return this.loginUser(user.userId);
    }

    async refreshTokens(refreshToken: string) {
        try {
            const decoded = await this.jwtService.verifyAsync(refreshToken);
            const userId = decoded.sub;

            const storedRefreshToken = await this.jwtRepository.findRefreshToken(refreshToken);
            if (!storedRefreshToken || storedRefreshToken.userId !== userId) {
                throw new ForbiddenException('Invalid refresh token');
            }

            await this.jwtRepository.removeRefreshToken(refreshToken);
            return this.loginUser(userId);
        } catch (err) {
            throw new ForbiddenException('Invalid refresh token');
        }
    }

    async logout(walletAddress: string) {
        const user = await this.userService.findUserByWalletAddress(walletAddress);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        return this.logoutUser(user.userId);
    }
}
