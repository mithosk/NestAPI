import { Entity, Column, PrimaryGeneratedColumn, Generated } from 'typeorm'


@Entity('users')
export class UserEntity {

    @PrimaryGeneratedColumn()
    id: number


    @Generated('uuid')
    @Column({ unique: true })
    uuid: string

    @Column({ unique: true })
    email: string

    @Column()
    passwordHash: string

    @Column({ nullable: true })
    accessKey: string

    @Column()
    name: string

    @Column()
    surname: string

    @Column()
    registrationDate: Date

}