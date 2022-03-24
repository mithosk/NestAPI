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

  describe('list', () => {

    it('returns the second page', async () => {
      let categoryEntity: CategoryEntity = new CategoryEntity()
      categoryEntity.code = 'CATEGORY_CODE'
      await getRepository(CategoryEntity).insert(categoryEntity)

      for (let i = 0; i < 11; i++)
        await getRepository(ProductEntity).insert({
          code: 'PRODUCT_CODE_' + i,
          description: 'description',
          price: 15.1,
          insertDarte: new Date(),
          category: categoryEntity
        })

      let productPage = await service.list({ text: undefined }, ProductSortType.CodeAsc, 2, 10)

      expect(productPage.products.length).toBe(1)
      expect(productPage.pageCount).toBe(2)
      expect(productPage.productCount).toBe(11)
    })

    it('filters products by text', async () => {
      let categoryEntity: CategoryEntity = new CategoryEntity()
      categoryEntity.code = 'CATEGORY_CODE'
      await getRepository(CategoryEntity).insert(categoryEntity)

      for (let i = 0; i < 10; i++)
        await getRepository(ProductEntity).insert({
          code: '1_PRODUCT_CODE_' + i,
          description: 'description',
          price: 4,
          insertDarte: new Date(),
          category: categoryEntity
        })

      for (let i = 0; i < 10; i++)
        await getRepository(ProductEntity).insert({
          code: '2_PRODUCT_CODE_XXX_' + i,
          description: 'description',
          price: 4,
          insertDarte: new Date(),
          category: categoryEntity
        })

      for (let i = 0; i < 10; i++)
        await getRepository(ProductEntity).insert({
          code: '3_PRODUCT_CODE_' + i,
          description: 'description xxx',
          price: 4,
          insertDarte: new Date(),
          category: categoryEntity
        })

      let page = await service.list({ text: 'XxX' }, ProductSortType.PriceDesc, 1, 30)

      expect(page.productCount).toBe(20)
    })

    it('sort products by price', async () => {
      let categoryEntity: CategoryEntity = new CategoryEntity()
      categoryEntity.code = 'CATEGORY_CODE'
      await getRepository(CategoryEntity).insert(categoryEntity)

      for (let i = 0; i < 100; i++)
        await getRepository(ProductEntity).insert({
          code: 'PRODUCT_CODE_' + i,
          description: 'description',
          price: i,
          insertDarte: new Date(),
          category: categoryEntity
        })

      let page = await service.list({ text: undefined }, ProductSortType.PriceDesc, 1, 1)

      expect(page.products[0].price).toBe(99)
    })

  })
})