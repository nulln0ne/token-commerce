import { IJwtToken, IJwtAccessToken, IJwtRefreshToken } from './jwt-entity.interface';

export class JwtTokenEntity implements IJwtToken {
    id: number;
    ttl: number;
    createdAt: Date;
    updatedAt: Date;

    constructor(id: number, ttl: number, createdAt: Date, updatedAt: Date) {
        this.id = id;
        this.ttl = ttl;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

export class JwtAccessTokenEntity extends JwtTokenEntity implements IJwtAccessToken {
    accessToken: string;

    constructor(id: number, ttl: number, accessToken: string, createdAt: Date, updatedAt: Date) {
        super(id, ttl, createdAt, updatedAt);
        this.accessToken = accessToken;
    }
}

export class JwtRefreshTokenEntity extends JwtTokenEntity implements IJwtRefreshToken {
    refreshToken: string;

    constructor(id: number, ttl: number, refreshToken: string, createdAt: Date, updatedAt: Date) {
        super(id, ttl, createdAt, updatedAt);
        this.refreshToken = refreshToken;
    }
}
