import { IDatabaseConfig } from '../interfaces/database.config.interface';
import { registerAs } from '@nestjs/config';

export default registerAs(
    'database',
    (): IDatabaseConfig => ({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10) || 5432,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        synchronize: process.env.TYPEORM_SYNC === 'true',
        autoLoadEntities: true,
    }),
);
