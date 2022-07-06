import { TypeOrmModule } from '@nestjs/typeorm'
import { NotFoundException } from '@nestjs/common'
import { CategoryModel } from './category.interface'
import { CategoryService } from './category.service'
import { Test, TestingModule } from '@nestjs/testing'
import { getConnection, getRepository } from 'typeorm'
import { ProductEntity } from '../../data/entities/product.entity'
import { CategoryEntity } from '../../data/entities/category.entity'
import { CategoryRepository } from '../../data/repositories/category.repository'

describe('CategoryService', () => {
	let service: CategoryService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [CategoryService],
			imports: [
				TypeOrmModule.forFeature([CategoryRepository]),
				TypeOrmModule.forRoot({
					type: 'sqlite',
					database: 'sqlite/89f27b24-523b-49a2-ac0b-33bc96b13d97',
					entities: [CategoryEntity, ProductEntity],
					synchronize: true,
					dropSchema: true
				})
			]
		}).compile()

		service = module.get<CategoryService>(CategoryService)
	})

	afterEach(async () => {
		await getConnection().close()
	})

	describe('read', () => {
		it('does not find the category', async () => {
			const readPromise = async (): Promise<CategoryModel> =>
				service.read('216e9e72-3af2-4202-ba9f-6ef1f8cc7ab4')

			await expect(readPromise()).rejects.toThrow(NotFoundException)
		})

		it('retrieves the category', async () => {
			const uuid = 'eda1da2b-494c-44bc-8e9c-6f40644a70c9'

			await getRepository(CategoryEntity).insert({
				uuid: uuid,
				code: 'CATEGORY_CODE'
			})

			const category = await service.read(uuid)

			expect(category.code).toEqual('CATEGORY_CODE')
		})
	})

	describe('update', () => {
		it('edit the category', async () => {
			const uuid = '54e474e8-df25-4dbf-9b6f-fce4b5bd5bea'

			await getRepository(CategoryEntity).insert({
				uuid: uuid,
				code: 'CATEGORY_CODE_1',
				description: 'category description 1'
			})

			const categoryModel = await service.update({
				id: uuid,
				code: 'CATEGORY_CODE_2',
				description: 'category description 2'
			})

			expect(categoryModel.code).toEqual('CATEGORY_CODE_2')
			expect(categoryModel.description).toEqual('category description 2')

			const categoryEntity = await getRepository(CategoryEntity)
				.createQueryBuilder('cat')
				.where('cat.uuid=:uuid', { uuid: uuid })
				.getOne()

			expect(categoryEntity.code).toEqual('CATEGORY_CODE_2')
			expect(categoryEntity.description).toEqual('category description 2')
		})
	})
})