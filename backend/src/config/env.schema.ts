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
}
