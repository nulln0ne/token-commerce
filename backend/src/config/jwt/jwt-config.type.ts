export interface JwtConfig {
    jwtAccess: {
        secret: string;
        expirationTime: number;
    };
    jwtRefresh: {
        secret: string;
        expirationTime: number;
    };
}
