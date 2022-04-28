import { getConnection } from 'typeorm'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CategoryService } from './category.service'
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
          database: 'sqlite/8273b58b-be7a-47bd-813c-4f235edf1bce',
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
        id: 'a4f6fd78-7b42-44ed-948c-9f0f28dd8caf',
        code: 'CATEGORY_CODE_1',
        description: 'category description 1'
      }))

      jest.spyOn(service, 'update').mockImplementation(() => Promise.resolve({
        id: '3ee405f3-3558-4a77-bdab-49410f39107d',
        code: 'CATEGORY_CODE_2',
        description: 'category description 2'
      }))

      let category = await controller.patch('9671b89b-cb60-4832-991e-ab2ccb16c79b', {
        code: 'CATEGORY_CODE_3',
        description: 'category description 3'
      })

      expect(category.code).toEqual('CATEGORY_CODE_2')
      expect(category.description).toEqual('category description 2')
    })

  })
})