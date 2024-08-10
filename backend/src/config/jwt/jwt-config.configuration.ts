import { JwtConfig } from './jwt-config.type';

export const jwtConfiguration = (): JwtConfig => {
    return {
        jwtAccess: {
            secret: process.env.JWT_ACCESS_SECRET,
            expirationTime: parseInt(process.env.JWT_ACCESS_EXPIRATION_TIME, 10),
        },

        jwtRefresh: {
            secret: process.env.JWT_REFRESH_SECRET,
            expirationTime: parseInt(process.env.JWT_REFRESH_EXPIRATION_TIME, 10),
        },
    };
};
