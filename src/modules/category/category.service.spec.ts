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
        TypeOrmModule.forFeature([
          CategoryRepository
        ]),
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: 'sqlite/89f27b24-523b-49a2-ac0b-33bc96b13d97',
          entities: [
            CategoryEntity,
            ProductEntity
          ],
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
      const readPromise = async (): Promise<CategoryModel> => service.read('216e9e72-3af2-4202-ba9f-6ef1f8cc7ab4')

      await expect(readPromise()).rejects.toThrow(NotFoundException)
    })

    it('retrieve the category', async () => {
      let uuid = 'eda1da2b-494c-44bc-8e9c-6f40644a70c9'

      await getRepository(CategoryEntity).insert({
        uuid: uuid,
        code: 'CATEGORY_CODE'
      })

      let category = await service.read(uuid)

      expect(category.code).toEqual('CATEGORY_CODE')
    })

  })
})