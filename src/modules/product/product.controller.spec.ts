import { getConnection } from 'typeorm'
import { ProductBus } from './product.bus'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductService } from './product.service'
import { Test, TestingModule } from '@nestjs/testing'
import { ProductController } from './product.controller'
import { ProductEntity } from '../../data/entities/product.entity'
import { CategoryEntity } from '../../data/entities/category.entity'
import { ProductRepository } from '../../data/repositories/product.repository'
import { CategoryRepository } from '../../data/repositories/category.repository'

describe('ProductController', () => {
  let controller: ProductController
  let service: ProductService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [ProductService, ProductBus],
      imports: [
        TypeOrmModule.forFeature([
          CategoryRepository,
          ProductRepository
        ]),
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: 'sqlite/a1aaf182-2222-419c-b132-bcad8bd043eb',
          entities: [
            CategoryEntity,
            ProductEntity
          ],
          synchronize: true,
          dropSchema: true
        })
      ]
    }).compile()

    controller = module.get<ProductController>(ProductController)
    service = module.get<ProductService>(ProductService)
  })

  afterEach(async () => {
    await getConnection().close()
  })

  describe('post', () => {

    it('creates a new product', async () => {
      jest.spyOn(service, 'create').mockImplementation(() => Promise.resolve({
        id: '9671b89b-cb60-4832-991e-ab2ccb16c79b',
        code: 'PRODUCT_CODE_1',
        description: 'product description',
        categoryId: 'e746b4da-9a1e-423b-87a4-53fa543e8f09',
        categoryCode: 'CATEGORY_CODE_1',
        price: 5
      }))

      let product = await controller.post({
        id: '5f4f5f67-cabd-4d41-93a1-4e9a756dde1c',
        code: 'PRODUCT_CODE_2',
        description: 'product description',
        categoryId: 'e41fc545-3421-47f2-ad81-92c1381456e1',
        categoryCode: 'CATEGORY_CODE_2',
        price: 5
      })

      expect(product.code).toEqual('PRODUCT_CODE_1')
      expect(product.categoryCode).toEqual('CATEGORY_CODE_1')
    })

  })
})