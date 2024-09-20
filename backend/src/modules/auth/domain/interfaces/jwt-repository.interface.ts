import { IJwtAccessToken, IJwtRefreshToken } from '../entities/jwt/jwt-entity.interface';

export interface IJwtRepository {
    saveAccessToken(token: IJwtAccessToken): Promise<void>;
    saveRefreshToken(token: IJwtRefreshToken): Promise<void>;
    findAccessTokenById(id: number): Promise<IJwtAccessToken | null>;
    findRefreshTokenById(id: number): Promise<IJwtRefreshToken | null>;
    removeAccessToken(id: number): Promise<void>;
    removeRefreshToken(id: number): Promise<void>;
}
