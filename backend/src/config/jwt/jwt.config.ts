import { IJwtConfig } from '../interfaces/jwt.config.interface';
import { registerAs } from '@nestjs/config';

export default registerAs(
    'jwt',
    (): IJwtConfig => ({
        accessSecret: process.env.JWT_ACCESS_SECRET,
        accessExpirationTime: process.env.JWT_ACCESS_EXPIRATION_TIME,
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        refreshExpirationTime: process.env.JWT_REFRESH_EXPIRATION_TIME,
    }),
);
