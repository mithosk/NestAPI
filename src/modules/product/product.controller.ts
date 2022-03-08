import { ProductQuery } from './product.query'
import { ProductModel } from './product.interface'
import { ProductService } from './product.service'
import { Body, Controller, Get, Post, Query, Headers } from '@nestjs/common'

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
    async list(@Query() query: ProductQuery, @Headers() headers: { [header: string]: string }): Promise<ProductModel[]> {
        let pageIndex = parseInt(headers['pageindex'])
        pageIndex = isNaN(pageIndex) ? 1 : pageIndex

        let pageSize = parseInt(headers['pagesize'])
        pageSize = isNaN(pageSize) ? 30 : pageSize

        return await this.productService.list(query)
    }
}