import { IJwtToken, IJwtAccessToken, IJwtRefreshToken } from './jwt-entity.interface';

export class JwtTokenEntity implements IJwtToken {
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

export class JwtAccessTokenEntity extends JwtTokenEntity implements IJwtAccessToken {
    accessToken: string;

    constructor(userId: string, ttl: number, accessToken: string) {
        const createdAt = new Date();
        const updatedAt = new Date();
        super(userId, ttl, createdAt, updatedAt);
        this.accessToken = accessToken;
    }
}

export class JwtRefreshTokenEntity extends JwtTokenEntity implements IJwtRefreshToken {
    refreshToken: string;

    constructor(userId: string, ttl: number, refreshToken: string) {
        const createdAt = new Date();
        const updatedAt = new Date();
        super(userId, ttl, createdAt, updatedAt);
        this.refreshToken = refreshToken;
    }
}
