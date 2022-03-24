import { ProductBus } from './product.bus'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductService } from './product.service'
import { ProductModel } from './product.interface'
import { ForbiddenException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getConnection, getRepository } from 'typeorm'
import { ProductEntity } from '../../data/entities/product.entity'
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
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: 'in-memory',
          entities: [
            CategoryEntity,
            ProductEntity
          ],
          synchronize: true,
          dropSchema: true
        }),
        TypeOrmModule.forFeature([
          CategoryRepository,
          ProductRepository
        ])
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
      let busMessage: any
      jest.spyOn(bus, 'notify').mockImplementation((event, message) => {
        busEvent = event
        busMessage = message
      })

      let productModel = await service.create({
        id: undefined,
        code: 'PRODUCT_CODE',
        description: 'product description',
        categoryId: undefined,
        categoryCode: 'CATEGORY_CODE',
        price: 12.45
      })

      let productEntity: ProductEntity = await getRepository(ProductEntity)
        .createQueryBuilder('pro')
        .where('pro.code=:code', { code: 'PRODUCT_CODE' })
        .leftJoinAndSelect('pro.category', 'cat')
        .getOne()

      expect(productModel.id).toBeDefined()
      expect(productModel.code).toBe('PRODUCT_CODE')
      expect(productModel.description).toBe('product description')
      expect(productModel.categoryId).toBeDefined()
      expect(productModel.categoryCode).toBe('CATEGORY_CODE')
      expect(productModel.price).toBe(12.45)

      expect(productEntity.code).toBe('PRODUCT_CODE')
      expect(productEntity.description).toBe('product description')
      expect(productEntity.category.code).toBe('CATEGORY_CODE')
      expect(productEntity.price).toBe(12.45)

      expect(busEvent).toBe('ProductCreated')
      expect(busMessage.id).toBeDefined()
      expect(busMessage.code).toBe('PRODUCT_CODE')
      expect(busMessage.description).toBe('product description')
      expect(busMessage.categoryId).toBeDefined()
      expect(busMessage.categoryCode).toBe('CATEGORY_CODE')
      expect(busMessage.price).toBe(12.45)
    })

    it('creates a new product with an old category', async () => {
      let busEvent: string
      let busMessage: any
      jest.spyOn(bus, 'notify').mockImplementation((event, message) => {
        busEvent = event
        busMessage = message
      })

      await getRepository(CategoryEntity).insert({
        code: 'CATEGORY_CODE'
      })

      let productModel = await service.create({
        id: undefined,
        code: 'PRODUCT_CODE',
        description: 'product description',
        categoryId: undefined,
        categoryCode: 'CATEGORY_CODE',
        price: 5
      })

      let productEntity: ProductEntity = await getRepository(ProductEntity)
        .createQueryBuilder('pro')
        .where('pro.code=:code', { code: 'PRODUCT_CODE' })
        .leftJoinAndSelect('pro.category', 'cat')
        .getOne()

      expect(productModel.id).toBeDefined()
      expect(productModel.code).toBe('PRODUCT_CODE')
      expect(productModel.description).toBe('product description')
      expect(productModel.categoryId).toBeDefined()
      expect(productModel.categoryCode).toBe('CATEGORY_CODE')
      expect(productModel.price).toBe(5)

      expect(productEntity.code).toBe('PRODUCT_CODE')
      expect(productEntity.description).toBe('product description')
      expect(productEntity.category.code).toBe('CATEGORY_CODE')
      expect(productEntity.price).toBe(5)

      expect(busEvent).toBe('ProductCreated')
      expect(busMessage.id).toBeDefined()
      expect(busMessage.code).toBe('PRODUCT_CODE')
      expect(busMessage.description).toBe('product description')
      expect(busMessage.categoryId).toBeDefined()
      expect(busMessage.categoryCode).toBe('CATEGORY_CODE')
      expect(busMessage.price).toBe(5)
    })

    it('generates an error to block duplication of the product code', async () => {
      await getRepository(ProductEntity).insert({
        code: 'PRODUCT_CODE',
        description: 'description',
        price: 3.2,
        insertDarte: new Date()
      })

      const createPromise = async (): Promise<ProductModel> => await service.create({
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
})