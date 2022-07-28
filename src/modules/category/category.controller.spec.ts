import { getConnection } from 'typeorm'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CategoryService } from './category.service'
import { CategoryModel } from './category.interface'
import { Test, TestingModule } from '@nestjs/testing'
import { CategoryController } from './category.controller'
import { ProductEntity } from '../../data/entities/product.entity'
import { CategoryEntity } from '../../data/entities/category.entity'
import { CategoryRepository } from '../../data/repositories/category.repository'

describe('CategoryController', () => {
	let controller: CategoryController
	let service: CategoryService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [CategoryController],
			providers: [CategoryService],
			imports: [
				TypeOrmModule.forFeature([CategoryRepository]),
				TypeOrmModule.forRoot({
					type: 'sqlite',
					database: 'sqlite/894b01f5-f586-49a3-8423-b8ec6c410d16',
					entities: [CategoryEntity, ProductEntity],
					synchronize: true,
					dropSchema: true
				})
			]
		}).compile()

		controller = module.get<CategoryController>(CategoryController)
		service = module.get<CategoryService>(CategoryService)
	})

	afterEach(async () => {
		await getConnection().close()
	})

	describe('put', () => {
		it('updates category', async () => {
			const id = '1315625a-76da-4a1e-89dc-fc822797804d'

			jest.spyOn(service, 'update').mockImplementation(async (category: CategoryModel) => {
				return {
					id: category.id,
					code: category.code + '_B',
					description: category.description + ' b'
				}
			})

			const category = await controller.put(id, {
				id: undefined,
				code: 'CATEGORY_CODE',
				description: 'category description'
			})

			expect(category.id).toEqual(id)
			expect(category.code).toEqual('CATEGORY_CODE_B')
			expect(category.description).toEqual('category description b')
		})
	})

	describe('patch', () => {
		it('updates code', async () => {
			jest.spyOn(service, 'read').mockImplementation(() =>
				Promise.resolve({
					id: 'f1c4bdbe-935f-45a7-a977-7edb0c864e4b',
					code: 'CATEGORY_CODE_1',
					description: 'category description 1'
				})
			)

			let updateCode: string
			let updateDescription: string
			jest.spyOn(service, 'update').mockImplementation(async (category: CategoryModel) => {
				updateCode = category.code
				updateDescription = category.description

				return {
					id: '4d037bcd-8388-448d-a0c1-f79727164b0b',
					code: 'CATEGORY_CODE_2',
					description: 'category description 2'
				}
			})

			const category = await controller.patch('3cd50e1f-2214-4eed-a1dd-bdf4018f88cb', {
				code: 'CATEGORY_CODE_3'
			})

			expect(updateCode).toEqual('CATEGORY_CODE_3')
			expect(updateDescription).toEqual('category description 1')

			expect(category.code).toEqual('CATEGORY_CODE_2')
			expect(category.description).toEqual('category description 2')
		})

		it('updates description', async () => {
			jest.spyOn(service, 'read').mockImplementation(() =>
				Promise.resolve({
					id: '3926ee80-8724-48cc-bd85-a02334fa305f',
					code: 'CATEGORY_CODE_1',
					description: 'category description 1'
				})
			)

			let updateCode: string
			let updateDescription: string
			jest.spyOn(service, 'update').mockImplementation(async (category: CategoryModel) => {
				updateCode = category.code
				updateDescription = category.description

				return {
					id: 'e26aba56-b7a8-44b3-99f1-a1c467f9dd22',
					code: 'CATEGORY_CODE_2',
					description: 'category description 2'
				}
			})

			const category = await controller.patch('277000fb-b44c-4b51-883f-ee22d96968b6', {
				description: 'category description 3'
			})

			expect(updateCode).toEqual('CATEGORY_CODE_1')
			expect(updateDescription).toEqual('category description 3')

			expect(category.code).toEqual('CATEGORY_CODE_2')
			expect(category.description).toEqual('category description 2')
		})

		it('updates code and description', async () => {
			jest.spyOn(service, 'read').mockImplementation(() =>
				Promise.resolve({
					id: '90e49f64-b92e-4c9f-bc43-8c205295149b',
					code: 'CATEGORY_CODE_1',
					description: 'category description 1'
				})
			)

			let updateCode: string
			let updateDescription: string
			jest.spyOn(service, 'update').mockImplementation(async (category: CategoryModel) => {
				updateCode = category.code
				updateDescription = category.description

				return {
					id: '69d5567f-20d0-4487-8601-a2b55cc035e4',
					code: 'CATEGORY_CODE_2',
					description: 'category description 2'
				}
			})

			const category = await controller.patch('ede45ec6-f751-4140-89aa-60fc6a0ad44b', {
				code: 'CATEGORY_CODE_3',
				description: 'category description 3'
			})

			expect(updateCode).toEqual('CATEGORY_CODE_3')
			expect(updateDescription).toEqual('category description 3')

			expect(category.code).toEqual('CATEGORY_CODE_2')
			expect(category.description).toEqual('category description 2')
		})
	})
})
