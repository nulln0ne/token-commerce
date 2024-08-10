export interface JwtToken {
    userId: string;
    ttl: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface JwtAccessToken extends JwtToken {
    accessToken: string;
}

export interface JwtRefreshToken extends JwtToken {
    refreshToken: string;
}
