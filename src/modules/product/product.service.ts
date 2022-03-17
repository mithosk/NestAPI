import { Connection } from 'typeorm'
import { ProductBus } from './product.bus'
import { ProductSort } from '../../data/sorts/product.sort'
import { ProductFilter } from 'src/data/filters/product.filter'
import { ForbiddenException, Injectable } from '@nestjs/common'
import { ProductEntity } from '../../data/entities/product.entity'
import { CategoryEntity } from '../../data/entities/category.entity'
import { ProductRepository } from '../../data/repositories/product.repository'
import { CategoryRepository } from '../../data/repositories/category.repository'
import { ProductModel, ProductQuery, ProductSortType } from './product.interface'

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

  public async list(query: ProductQuery, sort: ProductSortType, pageIndex: number, pageSize: number): Promise<ProductModel[]> {
    let filter: ProductFilter = {
      text: query.text
    }

    let entities = await this.productRepository.findByFilter(filter, ProductSort[ProductSortType[sort]], (pageIndex - 1) * pageSize, pageSize)
    let count = await this.productRepository.countByFilter(filter)

    return entities.map(per => <ProductModel>{
      code: per.code,
      categoryCode: per.category.code,
      description: per.description,
      price: per.price
    })
  }
}