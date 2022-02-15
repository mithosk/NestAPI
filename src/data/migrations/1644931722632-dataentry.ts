import { MigrationInterface, QueryRunner } from 'typeorm';

export class dataentry1644931722632 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query("INSERT INTO categories (code) VALUES ('BOOK')")
        queryRunner.query("INSERT INTO categories (code) VALUES ('CALENDAR')")

        queryRunner.query("INSERT INTO products (code, description, price, insertDarte, categoryId) VALUES ('ATTIMI_20X30', 'Book Attimi 20x30', 14.99, '2016-07-01', (SELECT id FROM categories WHERE code='BOOK'));")
        queryRunner.query("INSERT INTO products (code, description, price, insertDarte, categoryId) VALUES ('EVENTI_30X30', 'Book Eventi 20x30', 25.99, '2018-12-14', (SELECT id FROM categories WHERE code='BOOK'));")
        queryRunner.query("INSERT INTO products (code, description, price, insertDarte, categoryId) VALUES ('RACCONTI_32X27', 'Racconti Eventi 20x30', 25.99, '2021-12-10', (SELECT id FROM categories WHERE code='BOOK'));")
        queryRunner.query("INSERT INTO products (code, description, price, insertDarte, categoryId) VALUES ('CALENDAR_MONTH_20X30', 'Calendar Monthly 20x30', 11.99, '2021-09-19', (SELECT id FROM categories WHERE code='CALENDAR'));")
    }

    public async down(queryRunner: QueryRunner): Promise<void> { }
}