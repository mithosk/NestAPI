import { getConnection } from 'typeorm'
import { ProductBus } from './product.bus'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Response as HttpResponse } from 'express'
import { ProductModel } from './product.interface'
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

  describe('list', () => {

    it('returns a body with two products', async () => {
      //service mock
      jest.spyOn(service, 'list').mockImplementation(() => Promise.resolve({
        products: [
          {
            id: '4720f327-23e5-46ee-a226-51c3c0453559',
            code: 'PRODUCT_CODE_1',
            description: 'product description',
            categoryId: 'c03d23ec-a17d-4fe3-afb6-8aa66d56f9dd',
            categoryCode: 'CATEGORY_CODE_1',
            price: 5
          },
          {
            id: '410edf54-8282-44f6-924c-d6784fe5e287',
            code: 'PRODUCT_CODE_2',
            description: 'product description',
            categoryId: '93072e8c-0c73-4afd-89b1-431cf20f0ef0',
            categoryCode: 'CATEGORY_CODE_2',
            price: 5
          }
        ],
        pageCount: 3,
        productCount: 15
      }))

      //response mock
      let responseBody: ProductModel[] = []

      let httpResponse = <HttpResponse<any, Record<string, any>>>{

        set(key: string, value: string) {
          return this
        },

        json(body: ProductModel[]) {
          responseBody = body
        }

      }

      //execution of the function to be tested
      await controller.list({ text: undefined }, {}, httpResponse)

      //check
      expect(responseBody.length).toEqual(2)
      expect(responseBody[0].code).toEqual('PRODUCT_CODE_1')
      expect(responseBody[1].code).toEqual('PRODUCT_CODE_2')
    })

  })
})