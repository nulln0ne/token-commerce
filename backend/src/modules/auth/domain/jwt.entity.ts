import { JwtToken, JwtAccessToken, JwtRefreshToken } from './jwt.interface';

export class JwtTokenEntity implements JwtToken {
    userId: string;
    ttl: number;
    createdAt: Date;
    updatedAt: Date;

    constructor(userId: string, ttl: number, createdAt: Date, updatedAt: Date) {
        this.userId = userId;
        this.ttl = ttl;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

export class JwtAccessTokenEntity extends JwtTokenEntity implements JwtAccessToken {
    accessToken: string;

    constructor(userId: string, ttl: number, createdAt: Date, updatedAt: Date, accessToken: string) {
        super(userId, ttl, createdAt, updatedAt);
        this.accessToken = accessToken;
    }
}

export class JwtRefreshTokenEntity extends JwtTokenEntity implements JwtRefreshToken {
    refreshToken: string;

    constructor(userId: string, ttl: number, createdAt: Date, updatedAt: Date, refreshToken: string) {
        super(userId, ttl, createdAt, updatedAt);
        this.refreshToken = refreshToken;
    }
}
