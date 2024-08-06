import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './database.config';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: () => {
                return {
                    ...dataSourceOptions,
                    autoLoadEntities: true,
                };
            },
        }),
    ],
})
export class TypeOrmConfigModule {}
