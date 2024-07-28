import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { RedisService } from 'src/shared/redis/redis.service';
import { AuthService } from '../domain/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    private readonly logger = new Logger(JwtStrategy.name);

    constructor(
        private readonly configService: ConfigService,
        private readonly redisService: RedisService,
        private readonly authService: AuthService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'),
        });
    }

    async validate(payload: any) {
        this.logger.log(`Validating user with ID: ${payload.userId}`);

        // Проверка токена в Redis
        const tokenExists = await this.redisService.getToken(`access:${payload.userId}`);
        if (!tokenExists) {
            this.logger.warn(`Token not found for user ID: ${payload.userId}`);
            throw new UnauthorizedException('Invalid token');
        }

        // Проверка пользователя в базе данных
        const user = await this.authService.validateUser(payload);
        if (!user) {
            this.logger.warn(`No user found with ID: ${payload.userId}`);
            throw new UnauthorizedException('Invalid token');
        }
        return user;
    }
}
