export interface IJwtConfig {
    accessSecret: string;
    accessExpirationTime: string;
    refreshSecret: string;
    refreshExpirationTime: string;
}
