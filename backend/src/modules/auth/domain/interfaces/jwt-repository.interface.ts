import { IJwtAccessToken, IJwtRefreshToken } from '../entities/jwt/jwt-entity.interface';

export interface IJwtRepository {
    saveAccessToken(token: IJwtAccessToken): Promise<void>;
    saveRefreshToken(token: IJwtRefreshToken): Promise<void>;
    findAccessTokenByUserId(userId: string): Promise<IJwtAccessToken | null>;
    findRefreshTokenByUserId(userId: string): Promise<IJwtRefreshToken | null>;
    removeAccessToken(userId: string): Promise<void>;
    removeRefreshToken(userId: string): Promise<void>;
}
