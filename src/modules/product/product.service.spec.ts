import { ProductBus } from './product.bus'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductService } from './product.service'
import { ForbiddenException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getConnection, getRepository } from 'typeorm'
import { ProductEntity } from '../../data/entities/product.entity'
import { ProductModel, ProductSortType } from './product.interface'
import { CategoryEntity } from '../../data/entities/category.entity'
import { ProductRepository } from '../../data/repositories/product.repository'
import { CategoryRepository } from '../../data/repositories/category.repository'

describe('ProductService', () => {
	let service: ProductService
	let bus: ProductBus

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [ProductService, ProductBus],
			imports: [
				TypeOrmModule.forFeature([CategoryRepository, ProductRepository]),
				TypeOrmModule.forRoot({
					type: 'sqlite',
					database: 'sqlite/e5e26271-2f0d-485d-ba98-f4e8186d6594',
					entities: [CategoryEntity, ProductEntity],
					synchronize: true,
					dropSchema: true
				})
			]
		}).compile()

		service = module.get<ProductService>(ProductService)
		bus = module.get<ProductBus>(ProductBus)
	})

	afterEach(async () => {
		await getConnection().close()
	})

	describe('create', () => {
		it('creates a new product with a new category', async () => {
			let busEvent: string
			let busMessage: ProductModel
			jest.spyOn(bus, 'notify').mockImplementation((event, message: ProductModel) => {
				busEvent = event
				busMessage = message
			})

			const productModel = await service.create({
				id: undefined,
				code: 'PRODUCT_CODE',
				description: 'product description',
				categoryId: undefined,
				categoryCode: 'CATEGORY_CODE',
				price: 12.45
			})

			const productEntity: ProductEntity = await getRepository(ProductEntity)
				.createQueryBuilder('pro')
				.where('pro.code=:code', { code: productModel.code })
				.leftJoinAndSelect('pro.category', 'cat')
				.getOne()

			expect(productModel.id).toBeDefined()
			expect(productModel.code).toBe('PRODUCT_CODE')
			expect(productModel.description).toBe('product description')
			expect(productModel.categoryId).toBeDefined()
			expect(productModel.categoryCode).toBe('CATEGORY_CODE')
			expect(productModel.price).toBe(12.45)

			expect(productEntity.code).toBe(productModel.code)
			expect(productEntity.description).toBe(productModel.description)
			expect(productEntity.price).toBe(productModel.price)
			expect(productEntity.category.code).toBe(productModel.categoryCode)

			expect(busEvent).toBe('ProductCreated')
			expect(busMessage.id).toBeDefined()
			expect(busMessage.code).toBe(productModel.code)
			expect(busMessage.description).toBe(productModel.description)
			expect(busMessage.categoryId).toBeDefined()
			expect(busMessage.categoryCode).toBe(productModel.categoryCode)
			expect(busMessage.price).toBe(productModel.price)
		})

		it('creates a new product with an old category', async () => {
			let busEvent: string
			let busMessage: ProductModel
			jest.spyOn(bus, 'notify').mockImplementation((event, message: ProductModel) => {
				busEvent = event
				busMessage = message
			})

			await getRepository(CategoryEntity).insert({
				code: 'CATEGORY_CODE'
			})

			const productModel = await service.create({
				id: undefined,
				code: 'PRODUCT_CODE',
				description: 'product description',
				categoryId: undefined,
				categoryCode: 'CATEGORY_CODE',
				price: 5
			})

			const productEntity: ProductEntity = await getRepository(ProductEntity)
				.createQueryBuilder('pro')
				.where('pro.code=:code', { code: productModel.code })
				.leftJoinAndSelect('pro.category', 'cat')
				.getOne()

			expect(productModel.id).toBeDefined()
			expect(productModel.code).toBe('PRODUCT_CODE')
			expect(productModel.description).toBe('product description')
			expect(productModel.categoryId).toBeDefined()
			expect(productModel.categoryCode).toBe('CATEGORY_CODE')
			expect(productModel.price).toBe(5)

			expect(productEntity.code).toBe(productModel.code)
			expect(productEntity.description).toBe(productModel.description)
			expect(productEntity.price).toBe(productModel.price)
			expect(productEntity.category.code).toBe(productModel.categoryCode)

			expect(busEvent).toBe('ProductCreated')
			expect(busMessage.id).toBeDefined()
			expect(busMessage.code).toBe(productModel.code)
			expect(busMessage.description).toBe(productModel.description)
			expect(busMessage.categoryId).toBeDefined()
			expect(busMessage.categoryCode).toBe(productModel.categoryCode)
			expect(busMessage.price).toBe(productModel.price)
		})

		it('generates an error to block duplication of the product code', async () => {
			await getRepository(ProductEntity).insert({
				code: 'PRODUCT_CODE',
				description: 'description',
				price: 3.2,
				insertDate: new Date()
			})

			const createPromise = async (): Promise<ProductModel> =>
				await service.create({
					id: undefined,
					code: 'PRODUCT_CODE',
					description: 'product description',
					categoryId: undefined,
					categoryCode: 'CATEGORY_CODE',
					price: 5.4
				})

			await expect(createPromise()).rejects.toThrow(ForbiddenException)
		})
	})

	describe('list', () => {
		it('returns the second page', async () => {
			const categoryEntity: CategoryEntity = new CategoryEntity()
			categoryEntity.code = 'CATEGORY_CODE'
			await getRepository(CategoryEntity).insert(categoryEntity)

			for (let i = 0; i < 11; i++)
				await getRepository(ProductEntity).insert({
					code: 'PRODUCT_CODE_' + i,
					description: 'description',
					price: 15.1,
					insertDate: new Date(),
					category: categoryEntity
				})

			const productPage = await service.list({ text: undefined }, ProductSortType.CodeAsc, 2, 10)

			expect(productPage.products.length).toBe(1)
			expect(productPage.pageCount).toBe(2)
		})

		it('filters products by text', async () => {
			const categoryEntity: CategoryEntity = new CategoryEntity()
			categoryEntity.code = 'CATEGORY_CODE'
			await getRepository(CategoryEntity).insert(categoryEntity)

			for (let i = 0; i < 10; i++)
				await getRepository(ProductEntity).insert({
					code: '1_PRODUCT_CODE_' + i,
					description: 'description',
					price: 4,
					insertDate: new Date(),
					category: categoryEntity
				})

			for (let i = 0; i < 10; i++)
				await getRepository(ProductEntity).insert({
					code: '2_PRODUCT_CODE_XXX_' + i,
					description: 'description',
					price: 4,
					insertDate: new Date(),
					category: categoryEntity
				})

			for (let i = 0; i < 10; i++)
				await getRepository(ProductEntity).insert({
					code: '3_PRODUCT_CODE_' + i,
					description: 'description xxx',
					price: 4,
					insertDate: new Date(),
					category: categoryEntity
				})

			const productPage = await service.list({ text: 'XxX' }, ProductSortType.PriceDesc, 1, 30)

			expect(productPage.productCount).toBe(20)
		})

		it('sort products by price', async () => {
			const categoryEntity: CategoryEntity = new CategoryEntity()
			categoryEntity.code = 'CATEGORY_CODE'
			await getRepository(CategoryEntity).insert(categoryEntity)

			for (let i = 0; i < 100; i++)
				await getRepository(ProductEntity).insert({
					code: 'PRODUCT_CODE_' + i,
					description: 'description',
					price: i,
					insertDate: new Date(),
					category: categoryEntity
				})

			const productPage = await service.list({ text: undefined }, ProductSortType.PriceDesc, 1, 1)

			expect(productPage.products[0].price).toBe(99)
		})
	})
})
