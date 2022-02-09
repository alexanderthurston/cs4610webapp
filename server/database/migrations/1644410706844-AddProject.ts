import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class AddProject1644410706844 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'project',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'leaderId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'name',
            type: 'text',
            isNullable: false,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'project',
      new TableForeignKey({
        columnNames: ['leaderId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('project');
  }
}
