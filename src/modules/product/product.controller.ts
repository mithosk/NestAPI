import { ProductModel } from './product.model';
import { Controller, Get } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
    constructor(
        private readonly productService: ProductService
    ) { }

    @Get()
    async list(): Promise<ProductModel[]> {
        return await this.productService.list();
    }
}