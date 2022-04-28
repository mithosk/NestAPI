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
        TypeOrmModule.forFeature([
          CategoryRepository
        ]),
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: 'sqlite/894b01f5-f586-49a3-8423-b8ec6c410d16',
          entities: [
            CategoryEntity,
            ProductEntity
          ],
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

  describe('patch', () => {

    it('updates code and description', async () => {
      jest.spyOn(service, 'read').mockImplementation(() => Promise.resolve({
        id: '90e49f64-b92e-4c9f-bc43-8c205295149b',
        code: 'CATEGORY_CODE_1',
        description: 'category description 1'
      }))

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

      let category = await controller.patch('ede45ec6-f751-4140-89aa-60fc6a0ad44b', {
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