import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class UsersAndTransactions1727258683310 implements MigrationInterface {

    

    public async up(queryRunner: QueryRunner): Promise<void> {
        const userTableExists = await queryRunner.hasTable('users');
        if (userTableExists) {
            await queryRunner.dropTable('users', true); 
        }
        await queryRunner.createTable(
            new Table({
                name: 'users',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment'
                    },
                    {
                        name: 'walletAddress',
                        type: 'varchar',
                        isUnique: true
                    },
                    {
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'now()'
                    }
                ]
            })
        );

        await queryRunner.createTable(
            new Table({
                name: 'transactions',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment'
                    },
                    {
                        name: 'hash',
                        type: 'varchar',
                        isUnique: true
                    },
                    {
                        name: 'from',
                        type: 'varchar'
                    },
                    {
                        name: 'to',
                        type: 'varchar'
                    },
                    {
                        name: 'value',
                        type: 'decimal',
                        precision: 40,
                        scale: 18
                    },
                    {
                        name: 'timestamp',
                        type: 'bigint'
                    },
                    {
                        name: 'userId',
                        type: 'int',
                        isNullable: true
                    }
                ]
            })
        );

        await queryRunner.createForeignKey(
            'transactions',
            new TableForeignKey({
                columnNames: ['userId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'CASCADE'
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('transactions');
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('userId') !== -1);
        await queryRunner.dropForeignKey('transactions', foreignKey);

        await queryRunner.dropTable('transactions');
        await queryRunner.dropTable('users');
    }

}
