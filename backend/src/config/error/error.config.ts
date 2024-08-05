import { IErrorConfig } from '../interfaces/error.config.interface';
import { registerAs } from '@nestjs/config';

export default registerAs(
    'errors',
    (): IErrorConfig => ({
        USER_NOT_FOUND: 'User not found',
        INVALID_ACCESS_TOKEN: 'Invalid or expired access token',
        INVALID_REFRESH_TOKEN: 'Invalid or expired refresh token',
    }),
);
