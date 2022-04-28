import { MigrationInterface, QueryRunner } from 'typeorm'

export class defaultusers1651157606125 implements MigrationInterface {
    public async up(qr: QueryRunner): Promise<void> {
        await qr.query('INSERT INTO users (uuid, email, passwordHash, accessKey, name, surname, registrarionDate) VALUES (\'134ca54e-0ed5-42ab-9e01-640e0fe3d7de\', \'mithosk85@gmail.com\', \'33afd882929b8d834fcf0fab7383eed94f4c9fc226a49434a09fb8b0dc7da1dee5116f32c0fe9010cf8ffd0475d8e3ea846fd0b6b5bca0ae9c61355dd2b92f98\', null, \'Luca\', \'Nicolini\', \'2019-09-19\')')
        await qr.query('INSERT INTO users (uuid, email, passwordHash, accessKey, name, surname, registrarionDate) VALUES (\'db5cb3bd-80d5-4694-8cac-7b11771400f8\', \'jesty.ricci@gmail.com\', \'a747737003637ae4f91a0c9bbb5c7f9528afcd7bbf77832fbcf588dbf7cb2b84cda0679a43e42e799f2ad57606b17f8e236e0515f871ed52153a648273c62d7f\', null, \'Jessica\', \'Ricci\', \'2019-10-16\')')
    }

    public async down(): Promise<void> { }
}