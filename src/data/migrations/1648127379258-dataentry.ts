import { MigrationInterface, QueryRunner } from 'typeorm'

export class dataentry1648127379258 implements MigrationInterface {
    public async up(qr: QueryRunner): Promise<void> {
        await qr.query('INSERT INTO categories (code) VALUES (\'BOOK\')')
        await qr.query('INSERT INTO categories (code) VALUES (\'CALENDAR\')')

        await qr.query('INSERT INTO products (uuid, code, description, price, insertDarte, categoryId) VALUES (\'dbfa8f91-0f37-4c7b-b00a-7ad006d0ef33\', \'ATTIMI_20X30\', \'Book Attimi 20x30\', 14.99, \'2016-07-01\', (SELECT id FROM categories WHERE code=\'BOOK\'))')
        await qr.query('INSERT INTO products (uuid, code, description, price, insertDarte, categoryId) VALUES (\'8838f508-04c5-4ce6-857a-13549be1578b\', \'EVENTI_30X30\', \'Book Eventi 20x30\', 25.99, \'2018-12-14\', (SELECT id FROM categories WHERE code=\'BOOK\'))')
        await qr.query('INSERT INTO products (uuid, code, description, price, insertDarte, categoryId) VALUES (\'b702e590-183a-4702-ba2e-df0de8871095\', \'RACCONTI_32X27\', \'Racconti Eventi 20x30\', 25.99, \'2021-12-10\', (SELECT id FROM categories WHERE code=\'BOOK\'))')
        await qr.query('INSERT INTO products (uuid, code, description, price, insertDarte, categoryId) VALUES (\'a0d81ad3-b490-4cee-a163-8228e5513f64\', \'CALENDAR_MONTH_20X30\', \'Calendar Monthly 20x30\', 11.99, \'2021-09-19\', (SELECT id FROM categories WHERE code=\'CALENDAR\'))')
    }

    public async down(): Promise<void> { }
}