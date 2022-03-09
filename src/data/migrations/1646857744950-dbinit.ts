import {MigrationInterface, QueryRunner} from "typeorm";

export class dbinit1646857744950 implements MigrationInterface {
    name = 'dbinit1646857744950'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`products\` (\`id\` int NOT NULL AUTO_INCREMENT, \`code\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`price\` float NOT NULL, \`insertDarte\` datetime NOT NULL, \`categoryId\` int NULL, UNIQUE INDEX \`IDX_7cfc24d6c24f0ec91294003d6b\` (\`code\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`categories\` (\`id\` int NOT NULL AUTO_INCREMENT, \`code\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_77d7eff8a7aaa05457a12b8007\` (\`code\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_ff56834e735fa78a15d0cf21926\` FOREIGN KEY (\`categoryId\`) REFERENCES \`categories\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_ff56834e735fa78a15d0cf21926\``);
        await queryRunner.query(`DROP INDEX \`IDX_77d7eff8a7aaa05457a12b8007\` ON \`categories\``);
        await queryRunner.query(`DROP TABLE \`categories\``);
        await queryRunner.query(`DROP INDEX \`IDX_7cfc24d6c24f0ec91294003d6b\` ON \`products\``);
        await queryRunner.query(`DROP TABLE \`products\``);
    }

}
