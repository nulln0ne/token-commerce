import { JwtAccessToken, JwtRefreshToken } from './jwt.interface';

export interface IJwtRepository {
    saveAccessToken(token: JwtAccessToken): Promise<void>;
    saveRefreshToken(token: JwtRefreshToken): Promise<void>;
    findAccessToken(token: string): Promise<JwtAccessToken | null>;
    findRefreshToken(token: string): Promise<JwtRefreshToken | null>;
    findAccessTokensByUserId(userId: string): Promise<JwtAccessToken[]>;
    findRefreshTokensByUserId(userId: string): Promise<JwtRefreshToken[]>;
    deleteAccessToken(token: string): Promise<void>;
    deleteRefreshToken(token: string): Promise<void>;
    verifyToken(token: string): Promise<any>;
}
