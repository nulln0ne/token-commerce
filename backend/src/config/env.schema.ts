import { IsNumber, IsString } from 'class-validator';

export class EnvironmentVariables {
    @IsString()
    REDIS_URL: string;

    @IsNumber()
    POSTGRES_PORT: number;

    @IsString()
    POSTGRES_HOST: string;

    @IsString()
    POSTGRES_USER: string;

    @IsString()
    POSTGRES_PASSWORD: string;

    @IsString()
    POSTGRES_DB: string;

    @IsString()
    JWT_ACCESS_SECRET: string;

    @IsNumber()
    JWT_ACCESS_EXPIRATION_TIME: number;

    @IsString()
    JWT_REFRESH_SECRET: string;

    @IsNumber()
    JWT_REFRESH_EXPIRATION_TIME: number;
}
