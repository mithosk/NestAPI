import { ProductModel } from './product.model';
import { ProductService } from './product.service';
import { Controller, Get, Query } from '@nestjs/common';

@Controller('products')
export class ProductController {
    constructor(
        private readonly productService: ProductService
    ) { }

    @Get()
    async list(@Query() query): Promise<ProductModel[]> {
        return await this.productService.list(query);
    }
}