import { Connection } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ProductModel } from './product.model';
import { ProductEntity } from 'src/data/entities/product.entity';
import { CategoryEntity } from 'src/data/entities/category.entity';
import { ProductRepository } from 'src/data/repositories/product.repository';
import { CategoryRepository } from 'src/data/repositories/category.repository';

@Injectable()
export class ProductService {
  constructor(
    private dataConnection: Connection,
    private readonly categoryRepository: CategoryRepository,
    private readonly productRepository: ProductRepository
  ) { }

  public async create(product: ProductModel): Promise<ProductModel> {
    let categoryEntity = await this.categoryRepository.findBy(product.categoryCode)
    if (categoryEntity == null) {
      categoryEntity = new CategoryEntity()
      categoryEntity.code = product.categoryCode
    }

    let productEntity = new ProductEntity()
    productEntity.code = product.code
    productEntity.description = product.description
    productEntity.price = product.price
    productEntity.insertDarte = new Date()
    productEntity.category = categoryEntity

    await this.dataConnection.transaction(async em => {
      await em.save(categoryEntity)
      await em.save(productEntity)
    })

    return {
      code: productEntity.code,
      categoryCode: productEntity.category.code,
      description: productEntity.description,
      price: productEntity.price
    }
  }

  public async list(query: any): Promise<ProductModel[]> {
    let entities = await this.productRepository.findBy({
      text: query["text"]
    },
      null,
      null)

    let models: Array<ProductModel> = []
    for (let i = 0; i < entities.length; i++) {
      models.push({
        code: entities[i].code,
        categoryCode: entities[i].category.code,
        description: entities[i].description,
        price: entities[i].price
      })
    }

    return models
  }
}