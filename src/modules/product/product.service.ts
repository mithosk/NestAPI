import { Connection } from 'typeorm'
import { ProductBus } from './product.bus'
import { ProductPage } from './product.page'
import { ForbiddenException, Injectable } from '@nestjs/common'
import { ProductSort } from '../../data/enums/product-sort.enum'
import { ProductFilter } from '../..//data/filters/product.filter'
import { ProductEntity } from '../../data/entities/product.entity'
import { CategoryEntity } from '../../data/entities/category.entity'
import { ProductRepository } from '../../data/repositories/product.repository'
import { CategoryRepository } from '../../data/repositories/category.repository'
import { ProductModel, ProductQuery, ProductSortType } from './product.interface'

@Injectable()
export class ProductService {
	constructor(
		private readonly categoryRepository: CategoryRepository,
		private readonly productRepository: ProductRepository,
		private readonly dataConnection: Connection,
		private readonly productBus: ProductBus
	) {}

	public async create(product: ProductModel): Promise<ProductModel> {
		const sameCodeProduct = await this.productRepository.findByCode(product.code)
		if (sameCodeProduct !== undefined) throw new ForbiddenException('product code already used')

		let categoryEntity = await this.categoryRepository.findByCode(product.categoryCode)
		if (categoryEntity === undefined) {
			categoryEntity = new CategoryEntity()
			categoryEntity.code = product.categoryCode
		}

		const productEntity = new ProductEntity()
		productEntity.code = product.code
		productEntity.description = product.description
		productEntity.price = product.price
		productEntity.insertDate = new Date()
		productEntity.category = categoryEntity

		await this.dataConnection.transaction(async em => {
			await em.save(categoryEntity)
			await em.save(productEntity)
		})

		const mappedProduct = this.map(productEntity)

		this.productBus.notify('ProductCreated', mappedProduct)

		return mappedProduct
	}

	public async list(query: ProductQuery, sort: ProductSortType, pageIndex: number, pageSize: number): Promise<ProductPage> {
		const filter: ProductFilter = {
			text: query.text
		}

		const products = await this.productRepository.findByFilter(
			filter,
			ProductSort[ProductSortType[sort]],
			(pageIndex - 1) * pageSize,
			pageSize
		)

		const productCount = await this.productRepository.countByFilter(filter)

		return {
			products: products.map(per => this.map(per)),
			pageCount: Math.ceil(productCount / pageSize),
			productCount: productCount
		}
	}

	private map(entity: ProductEntity): ProductModel {
		return {
			id: entity.uuid,
			code: entity.code,
			description: entity.description,
			categoryId: entity.category.uuid,
			categoryCode: entity.category.code,
			price: entity.price
		}
	}
}
