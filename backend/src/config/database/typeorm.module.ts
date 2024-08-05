import { IDatabaseConfig } from '../interfaces/database.config.interface';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from './database.config';
import { Module } from '@nestjs/common';

@Module({
    imports: [
        ConfigModule.forFeature(databaseConfig),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                const dbConfig = configService.get<IDatabaseConfig>('database');
                return {
                    ...dbConfig,
                    autoLoadEntities: dbConfig.autoLoadEntities,
                };
            },
            inject: [ConfigService],
        }),
    ],
})
export class TypeOrmConfigModule {}
