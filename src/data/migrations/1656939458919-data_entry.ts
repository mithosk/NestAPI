import { MigrationInterface, QueryRunner } from 'typeorm'

export class dataEntry1656939458919 implements MigrationInterface {
    public async up(qr: QueryRunner): Promise<void> {
        await qr.query('INSERT INTO categories (uuid, code, description) VALUES (\'3260f259-a60a-4bd2-886d-adaea7916017\', \'BOOK\', null)')
        await qr.query('INSERT INTO categories (uuid, code, description) VALUES (\'4d0109bc-b5ff-4d4d-b1a9-83cc939e09b7\', \'CALENDAR\', null)')

        await qr.query('INSERT INTO products (uuid, code, description, price, insertDarte, categoryId) VALUES (\'dbfa8f91-0f37-4c7b-b00a-7ad006d0ef33\', \'ATTIMI_20X30\', \'Book Attimi 20x30\', 14.99, \'2016-07-01\', (SELECT id FROM categories WHERE code=\'BOOK\'))')
        await qr.query('INSERT INTO products (uuid, code, description, price, insertDarte, categoryId) VALUES (\'8838f508-04c5-4ce6-857a-13549be1578b\', \'EVENTI_30X30\', \'Book Eventi 20x30\', 25.99, \'2018-12-14\', (SELECT id FROM categories WHERE code=\'BOOK\'))')
        await qr.query('INSERT INTO products (uuid, code, description, price, insertDarte, categoryId) VALUES (\'b702e590-183a-4702-ba2e-df0de8871095\', \'RACCONTI_32X27\', \'Racconti Eventi 20x30\', 25.99, \'2021-12-10\', (SELECT id FROM categories WHERE code=\'BOOK\'))')
        await qr.query('INSERT INTO products (uuid, code, description, price, insertDarte, categoryId) VALUES (\'a0d81ad3-b490-4cee-a163-8228e5513f64\', \'CALENDAR_MONTH_20X30\', \'Calendar Monthly 20x30\', 11.99, \'2021-09-19\', (SELECT id FROM categories WHERE code=\'CALENDAR\'))')

        await qr.query('INSERT INTO users (uuid, email, passwordHash, accessKey, name, surname, registrationDate) VALUES (\'134ca54e-0ed5-42ab-9e01-640e0fe3d7de\', \'mithosk85@gmail.com\', \'33afd882929b8d834fcf0fab7383eed94f4c9fc226a49434a09fb8b0dc7da1dee5116f32c0fe9010cf8ffd0475d8e3ea846fd0b6b5bca0ae9c61355dd2b92f98\', null, \'Luca\', \'Nicolini\', \'2019-09-19\')')
        await qr.query('INSERT INTO users (uuid, email, passwordHash, accessKey, name, surname, registrationDate) VALUES (\'db5cb3bd-80d5-4694-8cac-7b11771400f8\', \'jesty.ricci@gmail.com\', \'a747737003637ae4f91a0c9bbb5c7f9528afcd7bbf77832fbcf588dbf7cb2b84cda0679a43e42e799f2ad57606b17f8e236e0515f871ed52153a648273c62d7f\', null, \'Jessica\', \'Ricci\', \'2019-10-16\')')
    }

    public async down(): Promise<void> { }
}