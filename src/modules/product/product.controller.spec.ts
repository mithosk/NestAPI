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

    it('xxxxx xxxxx xxxxx', async () => {
      expect(controller).toBeDefined()
    })

  })
})