import { Injectable } from '@nestjs/common';
import { ProductModel } from './product.interface';
import { ProductRepository } from 'src/data/repositories/product.repository';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository
  ) { }

  public async list(): Promise<ProductModel[]> {
    let count = await this.productRepository.countBy({ text: "xyz" })

    return [
      {
        code: "ATTIMI_20X30",
        categoryCode: "BOOK",
        description: "Book Attimi 20x30",
        price: count
      },
      {
        code: "CALENDAR_MONTH_20X30",
        categoryCode: "CALENDAR",
        description: "Monthly Calendar 20x30",
        price: count
      },
      {
        code: "PRINT_12X12",
        categoryCode: "PRINT",
        description: "Simple print 12x12",
        price: count
      }
    ];
  }
}