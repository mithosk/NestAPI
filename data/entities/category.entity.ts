import { ProductEntity } from './product.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';


@Entity()
export class CategoryEntity {

    @PrimaryGeneratedColumn()
    id: number



    @Column()
    code: string



    @OneToMany(() => ProductEntity, product => product.category)
    products: ProductEntity[]

}