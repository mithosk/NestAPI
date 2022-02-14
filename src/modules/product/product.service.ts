import { Injectable } from '@nestjs/common';
import { ProductModel } from './product.interface';

@Injectable()
export class ProductService {
  public list(): Array<ProductModel> {
    return [
      {
        code: "ATTIMI_20X30",
        categoryCode: "BOOK",
        description: "Book Attimi 20x30",
        price: 19.9
      },
      {
        code: "CALENDAR_MONTH_20X30",
        categoryCode: "CALENDAR",
        description: "Monthly Calendar 20x30",
        price: 14.9
      },
      {
        code: "PRINT_12X12",
        categoryCode: "PRINT",
        description: "Simple print 12x12",
        price: 0.39
      }
    ];
  }
}