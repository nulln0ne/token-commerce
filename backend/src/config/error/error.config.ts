import { IErrorConfig } from '../interfaces/error.config.interface';
import { registerAs } from '@nestjs/config';

export default registerAs(
    'errors',
    (): IErrorConfig => ({
        USER_NOT_FOUND: 'User not found',
        INVALID_ACCESS_TOKEN: 'Invalid or expired access token',
        INVALID_REFRESH_TOKEN: 'Invalid or expired refresh token',
        USER_ALREADY_EXISTS: 'User already exists',
        DATABASE_CONNECTION_ERROR: 'Failed to connect to the database',
        REDIS_CONNECTION_ERROR: 'Failed to connect to Redis',
        INVALID_CREDENTIALS: 'Invalid credentials provided',
        TOKEN_EXPIRED: 'Token has expired',
    }),
);
