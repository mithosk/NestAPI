import { ProductEntity } from './product.entity'
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, Generated } from 'typeorm'


@Entity('categories')
export class CategoryEntity {

    @PrimaryGeneratedColumn()
    id: number


    @Generated('uuid')
    @Column({ unique: true })
    uuid: string

    @Column({ unique: true })
    code: string

    @Column({ nullable: true })
    description: string


    @OneToMany(() => ProductEntity, per => per.category)
    products: ProductEntity[]

}