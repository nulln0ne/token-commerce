import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IDatabaseConfig } from '../interfaces/database.config.interface';

@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const config = configService.get<IDatabaseConfig>('database');
                return {
                    type: config.type,
                    host: config.host,
                    port: config.port,
                    username: config.username,
                    password: config.password,
                    database: config.database,
                    synchronize: config.synchronize,
                    autoLoadEntities: true,
                };
            },
        }),
    ],
})
export class TypeOrmConfigModule {}
