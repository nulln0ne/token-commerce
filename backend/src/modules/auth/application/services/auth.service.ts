import { Injectable, Inject, InternalServerErrorException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { IJwtRepository, INonceRepository, JwtAccessTokenEntity, JwtRefreshTokenEntity } from '../../domain';
import { JwtService } from '@nestjs/jwt';
import { JwtConfigService } from '@app/config';
import { v4 as uuidv4 } from 'uuid';
import { ethers } from 'ethers';
import { UserService } from 'src/modules/user/application';
import { CreateUserDto } from 'src/modules/user/application';

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

    private generateToken(userId: string, expiresIn: number, secret: string | Buffer): string {
        const payload = { sub: userId };
        const secretString = typeof secret === 'string' ? secret : secret.toString('utf-8');
        return this.jwtService.sign(payload, { expiresIn, secret: secretString });
    }

    private generateAccessToken(userId: string): JwtAccessTokenEntity {
        const jwtConfig = this.jwtConfigService.createJwtOptions();
        const ttl = Number(jwtConfig.signOptions.expiresIn);
        const accessToken = this.generateToken(userId, ttl, jwtConfig.secret);
        return new JwtAccessTokenEntity(userId, ttl, accessToken, new Date(), new Date());
    }

    private generateRefreshToken(userId: string): JwtRefreshTokenEntity {
        const refreshTokenConfig = this.jwtConfigService.getRefreshTokenConfig();
        const ttl = Number(refreshTokenConfig.signOptions.expiresIn);
        const refreshToken = this.generateToken(userId, ttl, refreshTokenConfig.secret);
        return new JwtRefreshTokenEntity(userId, ttl, refreshToken, new Date(), new Date());
    }

    async generateNonce(walletAddress: string): Promise<string> {
        const nonce = uuidv4();
        const nonceEntity = { walletAddress, nonce, createdAt: new Date() };
        await this.nonceRepository.saveNonce(nonceEntity);
        return nonce;
    }

    async verifySignature(walletAddress: string, signature: string): Promise<boolean> {
        const nonceEntity = await this.nonceRepository.findNonceByWalletAddress(walletAddress);
        if (!nonceEntity) {
            throw new UnauthorizedException('Nonce not found or expired');
        }

        const nonceMessage = `Sign this nonce: ${nonceEntity.nonce}`;

        try {
            const recoveredAddress = ethers.utils.verifyMessage(nonceMessage, signature);
            if (recoveredAddress.toLowerCase() === walletAddress.toLowerCase()) {
                await this.nonceRepository.removeNonce(walletAddress);
                return true;
            } else {
                return false;
            }
        } catch (error) {
            throw new UnauthorizedException('Invalid signature');
        }
    }

    async loginUser(userId: string) {
        if (!userId) {
            throw new InternalServerErrorException('User ID is undefined');
        }

        await this.logoutUser(userId);

        const accessTokenEntity = this.generateAccessToken(userId);
        const refreshTokenEntity = this.generateRefreshToken(userId);

        await this.jwtRepository.saveAccessToken(accessTokenEntity);
        await this.jwtRepository.saveRefreshToken(refreshTokenEntity);

        return {
            accessToken: accessTokenEntity.accessToken,
            refreshToken: refreshTokenEntity.refreshToken,
        };
    }

    async logoutUser(userId: string) {
        await this.jwtRepository.removeAccessToken(userId);
        await this.jwtRepository.removeRefreshToken(userId);
    }

    async validateToken(token: string, secret: string | Buffer): Promise<any> {
        const secretString = typeof secret === 'string' ? secret : secret.toString('utf-8');
        try {
            return await this.jwtService.verifyAsync(token, { secret: secretString });
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
            user = await this.userService.findUserByWalletAddress(walletAddress);
        }

        if (!user || !user.userId) {
            throw new InternalServerErrorException('User ID not found after user creation or lookup');
        }

        return this.loginUser(user.userId);
    }

    async refreshTokens(refreshToken: string) {
        try {
            const refreshTokenConfig = this.jwtConfigService.getRefreshTokenConfig();
            const decoded = await this.validateToken(refreshToken, refreshTokenConfig.secret);

            const userId = decoded.sub;

            const storedRefreshToken = await this.jwtRepository.findRefreshTokenByUserId(userId);
            if (!storedRefreshToken || storedRefreshToken.refreshToken !== refreshToken) {
                throw new ForbiddenException('Invalid refresh token');
            }

            await this.jwtRepository.removeRefreshToken(userId);
            return this.loginUser(userId);
        } catch (err) {
            throw new UnauthorizedException('Invalid token');
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
