import { DataSource, DataSourceOptions } from 'typeorm';
import { IDatabaseConfig } from '../interfaces/database.config.interface';
import { registerAs } from '@nestjs/config';
import { config } from 'dotenv';

config();

const getDatabaseConfig = (): IDatabaseConfig => ({
    type: 'postgres',
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT!, 10),
    username: process.env.DB_USERNAME!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_DATABASE!,
    synchronize: process.env.TYPEORM_SYNC === 'true',
});

export const dataSourceOptions: DataSourceOptions = {
    ...getDatabaseConfig(),
};

export const dataSource = new DataSource({
    ...dataSourceOptions,
    migrations: ['./migrations/*.ts'],
});

export default registerAs('database', getDatabaseConfig);
