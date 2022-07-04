import { CategoryEntity } from './category.entity'
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Generated } from 'typeorm'

@Entity('products')
export class ProductEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Generated('uuid')
	@Column({ unique: true })
	uuid: string

	@Column({ unique: true })
	code: string

	@Column()
	description: string

	@Column({ type: 'float' })
	price: number

	@Column()
	insertDate: Date

	@ManyToOne(() => CategoryEntity, cat => cat.products, { onDelete: 'CASCADE' })
	category: CategoryEntity
}
