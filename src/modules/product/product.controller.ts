import { ProductService } from './product.service'
import { Body, Controller, Get, Post, Query, Headers } from '@nestjs/common'
import { ProductModel, ProductQuery, ProductSortType } from './product.interface'

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
    async list(@Query() filter: ProductQuery, @Headers() headers: { [header: string]: string }): Promise<ProductModel[]> {
        let pageIndex = parseInt(headers['pageindex'])
        pageIndex = isNaN(pageIndex) ? 1 : pageIndex

        let pageSize = parseInt(headers['pagesize'])
        pageSize = isNaN(pageSize) ? 30 : pageSize

        let sortType = ProductSortType[headers['sorttype']]
        sortType = sortType === undefined ? ProductSortType.CodeAsc : sortType

        return await this.productService.list(filter, sortType, pageIndex, pageSize)
    }
}