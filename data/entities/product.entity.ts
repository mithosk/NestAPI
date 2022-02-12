import { CategoryEntity } from './category.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';


@Entity()
export class ProductEntity {

    @PrimaryGeneratedColumn()
    id: number



    @Column()
    code: string

    @Column()
    description: string

    @Column()
    price: number

    @Column()
    insertDarte: Date



    @ManyToOne(() => CategoryEntity, category => category.products)
    category: CategoryEntity;

}