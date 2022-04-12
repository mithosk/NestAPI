import {MigrationInterface, QueryRunner} from "typeorm";

export class categorydescription1649775189194 implements MigrationInterface {
    name = 'categorydescription1649775189194'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`categories\` ADD \`description\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`categories\` DROP COLUMN \`description\``);
    }

}
