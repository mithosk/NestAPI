import { Injectable } from '@nestjs/common';
import { ProductModel } from './product.model';
import { ProductRepository } from 'src/data/repositories/product.repository';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository
  ) { }

  public async list(): Promise<ProductModel[]> {
    let entities = await this.productRepository.findBy({
      text: null
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