import { Connection } from 'typeorm'
import { ProductBus } from './product.bus'
import { ProductModel } from './product.interface'
import { ProductFilter, ProductSort } from './product.query'
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
    if (productEntity !== undefined)
      throw new ForbiddenException('product code already used')

    let categoryEntity = await this.categoryRepository.findByCode(product.categoryCode)
    if (categoryEntity === undefined) {
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

    this.productBus.notify('ProductCreated', product)

    return product
  }

  public async list(filter: ProductFilter, sort: ProductSort, pageIndex: number, pageSize: number): Promise<ProductModel[]> {
    let entities = await this.productRepository.findByFilter(
      {
        text: filter.text
      },
      sort,
      (pageIndex - 1) * pageSize,
      pageSize
    )

    let products: Array<ProductModel> = []
    entities.forEach(per => products.push({
      code: per.code,
      categoryCode: per.category.code,
      description: per.description,
      price: per.price
    }))

    return products
  }
}