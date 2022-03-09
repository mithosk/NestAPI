import { Connection } from 'typeorm'
import { ProductBus } from './product.bus'
import { ProductFilter } from './product.query'
import { ProductModel } from './product.interface'
import { ForbiddenException, Injectable } from '@nestjs/common'
import { ProductEntity } from '../../data/entities/product.entity'
import { CategoryEntity } from '../../data/entities/category.entity'
import { ProductRepository } from '../../data/repositories/product.repository'
import { CategoryRepository } from '../../data/repositories/category.repository'

@Injectable()
export class ProductService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly productRepository: ProductRepository,
    private readonly productBus: ProductBus,
    private readonly dataConnection: Connection
  ) { }

  public async create(product: ProductModel): Promise<ProductModel> {
    let productEntity = await this.productRepository.findByCode(product.code)
    if (productEntity != null)
      throw new ForbiddenException("product code already used")

    let categoryEntity = await this.categoryRepository.findByCode(product.categoryCode)
    if (categoryEntity == null) {
      categoryEntity = new CategoryEntity()
      categoryEntity.code = product.categoryCode
    }

    productEntity = new ProductEntity()
    productEntity.code = product.code
    productEntity.description = product.description
    productEntity.price = product.price
    productEntity.insertDarte = new Date()
    productEntity.category = categoryEntity

    await this.dataConnection.transaction(async em => {
      await em.save(categoryEntity)
      await em.save(productEntity)
    })

    this.productBus.notify("ProductCreated", product)

    return product
  }

  public async list(query: ProductFilter, pageIndex: number, pageSize: number): Promise<ProductModel[]> {
    let entities = await this.productRepository.findByFilter({
      text: query.text
    },
      (pageIndex - 1) * pageSize,
      pageSize)

    let products: Array<ProductModel> = []
    for (let i = 0; i < entities.length; i++) {
      products.push({
        code: entities[i].code,
        categoryCode: entities[i].category.code,
        description: entities[i].description,
        price: entities[i].price
      })
    }

    return products
  }
}