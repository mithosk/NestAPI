import { ProductQuery } from './product.query'
import { ProductModel } from './product.interface'
import { ProductService } from './product.service'
import { Body, Controller, Get, Post, Query } from '@nestjs/common'

@Controller('products')
export class ProductController {
    constructor(
        private readonly productService: ProductService
    ) { }

    @Post()
    async post(@Body() body: ProductModel): Promise<ProductModel> {
        return await this.productService.create(body)
    }

    @Get()
    async list(@Query() query: ProductQuery): Promise<ProductModel[]> {
        return await this.productService.list(query)
    }
}