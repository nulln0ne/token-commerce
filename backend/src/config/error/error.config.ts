import { IErrorConfig } from '../interfaces/error.config.interface';
import { registerAs } from '@nestjs/config';

export default registerAs(
    'errors',
    (): IErrorConfig => ({
        INVALID_ACCESS_TOKEN: 'Invalid or expired access token',
        INVALID_REFRESH_TOKEN: 'Invalid or expired refresh token',
        ERROR_SAVING_ACCESS_TOKEN: 'Failed to save access token',
        ERROR_SAVING_REFRESH_TOKEN: 'Failed to save refresh token',
        FAILED_TO_RETRIEVE_ACCESS_TOKEN: 'Failed to retrieve access token',
        FAILED_TO_RETRIEVE_REFRESH_TOKEN: 'Failed to retrieve refresh token',
        FAILED_TO_DELETE_ACCESS_TOKEN: 'Failed to delete access token',
        FAILED_TO_DELETE_REFRESH_TOKEN: 'Failed to delete refresh token',
        FAILED_TO_VERIFY_ACCESS_TOKEN: 'Failed to verify access token',
        TOKEN_EXPIRED: 'Token has expired',

        USER_NOT_FOUND: 'User not found',
        USER_ALREADY_EXISTS: 'User already exists',

        DATABASE_CONNECTION_ERROR: 'Failed to connect to the database',
        REDIS_CONNECTION_ERROR: 'Failed to connect to Redis',

        INVALID_CREDENTIALS: 'Invalid credentials provided',
    }),
);
