import {MigrationInterface, QueryRunner} from "typeorm";

export class unique1644931636888 implements MigrationInterface {
    name = 'unique1644931636888'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`products\` ADD UNIQUE INDEX \`IDX_7cfc24d6c24f0ec91294003d6b\` (\`code\`)`);
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`price\``);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`price\` float NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`categories\` ADD UNIQUE INDEX \`IDX_77d7eff8a7aaa05457a12b8007\` (\`code\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`categories\` DROP INDEX \`IDX_77d7eff8a7aaa05457a12b8007\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`price\``);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`price\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` DROP INDEX \`IDX_7cfc24d6c24f0ec91294003d6b\``);
    }

}
