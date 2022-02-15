import { ProductEntity } from './product.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';


@Entity("categories")
export class CategoryEntity {

    @PrimaryGeneratedColumn()
    id: number



    @Column({ unique: true })
    code: string



    @OneToMany(() => ProductEntity, product => product.category)
    products: ProductEntity[]

}