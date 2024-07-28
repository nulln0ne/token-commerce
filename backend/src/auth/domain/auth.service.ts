import { Injectable, Logger, InternalServerErrorException, BadRequestException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/domain/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../application/create-user.dto';
import { RedisService } from 'src/shared/redis/redis.service';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
        private redisService: RedisService,
    ) {}

    async create(createUserDto: CreateUserDto) {
        this.logger.log(`Creating user with wallet address: ${createUserDto.walletAddress}`);
        try {
            const existingUser = await this.userRepository.findOne({
                where: { walletAddress: createUserDto.walletAddress },
            });
            if (existingUser) {
                this.logger.warn(`User with wallet address ${createUserDto.walletAddress} already exists`);
                throw new ConflictException('User with this wallet address already exists');
            }

            const user = this.userRepository.create(createUserDto);
            await this.userRepository.save(user);
            this.logger.log(`User created with ID: ${user.id}`);

            const payload = { userId: user.id };
            const accessToken = this.jwtService.sign(payload);
            const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

            await this.redisService.setToken(`access:${user.id}`, accessToken, 3600); // 1 час
            await this.redisService.setToken(`refresh:${user.id}`, refreshToken, 604800); // 7 дней

            this.logger.log(`JWT generated and stored in Redis for user ID: ${user.id}`);

            return { ...user, accessToken, refreshToken };
        } catch (error) {
            this.logger.error('Error creating user', error.stack);
            if (error instanceof BadRequestException) {
                throw new BadRequestException('Invalid input data');
            }
            if (error instanceof ConflictException) {
                throw error;
            }
            throw new InternalServerErrorException('Could not create user');
        }
    }

    async validateUser(payload: any): Promise<User | null> {
        this.logger.log(`Validating user with ID: ${payload.userId}`);
        try {
            const tokenValid = await this.redisService.getToken(`access:${payload.userId}`);
            if (!tokenValid) {
                this.logger.warn(`Token not found or expired for user ID: ${payload.userId}`);
                return null;
            }

            const user = await this.userRepository.findOne({ where: { id: payload.userId } });
            if (user) {
                this.logger.log(`User validated with ID: ${user.id}`);
            } else {
                this.logger.warn(`No user found with ID: ${payload.userId}`);
            }
            return user;
        } catch (error) {
            this.logger.error('Error validating user', error.stack);
            throw new InternalServerErrorException('Error validating user');
        }
    }

    async validateRefreshToken(refreshToken: string): Promise<string | null> {
        try {
            const payload = this.jwtService.verify(refreshToken);
            const tokenKey = `refresh:${payload.userId}`;
            const storedRefreshToken = await this.redisService.get(tokenKey);
            if (storedRefreshToken !== refreshToken) {
                this.logger.warn(`Invalid refresh token for user ID: ${payload.userId}`);
                return null;
            }
            return payload.userId;
        } catch (error) {
            this.logger.warn('Invalid or expired refresh token');
            return null;
        }
    }

    async refreshTokens(userId: string, refreshToken: string) {
        this.logger.log(`Refreshing tokens for user ID: ${userId}`);
        const tokenKey = `refresh:${userId}`;
        const storedRefreshToken = await this.redisService.get(tokenKey);
        if (storedRefreshToken !== refreshToken) {
            this.logger.warn(`Invalid refresh token for user ID: ${userId}`);
            throw new UnauthorizedException('Invalid refresh token');
        }

        const payload = { userId };
        const newAccessToken = this.jwtService.sign(payload);
        const newRefreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

        await this.redisService.setToken(`access:${userId}`, newAccessToken, 3600);
        await this.redisService.setToken(tokenKey, newRefreshToken, 604800);

        this.logger.log(`Tokens refreshed for user ID: ${userId}`);

        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }
}
