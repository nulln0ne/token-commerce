import { IJwtAccessToken, IJwtRefreshToken } from '../entities/jwt/jwt-entity.interface';

export interface IJwtRepository {
    saveAccessToken(token: IJwtAccessToken): Promise<void>;
    saveRefreshToken(token: IJwtRefreshToken): Promise<void>;
    findAccessToken(token: string): Promise<IJwtAccessToken | null>;
    findRefreshToken(token: string): Promise<IJwtRefreshToken | null>;
    findAccessTokensByUserId(userId: string): Promise<IJwtAccessToken[]>;
    findRefreshTokensByUserId(userId: string): Promise<IJwtRefreshToken[]>;
    removeAccessToken(token: string): Promise<void>;
    removeRefreshToken(token: string): Promise<void>;
    validateToken(token: string): Promise<any>;
}
