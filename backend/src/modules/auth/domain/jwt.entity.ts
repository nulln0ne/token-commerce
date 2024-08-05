export interface JwtAccessToken {
    userId: string;
    accessToken: string;
    ttl: number;
    jwtSecret: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface JwtRefreshToken {
    userId: string;
    refreshToken: string;
    ttl: number;
    jwtSecret: string;
    createdAt: Date;
    updatedAt: Date;
}
