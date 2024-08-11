export interface IJwtToken {
    userId: string;
    ttl: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IJwtAccessToken extends IJwtToken {
    accessToken: string;
}

export interface IJwtRefreshToken extends IJwtToken {
    refreshToken: string;
}
