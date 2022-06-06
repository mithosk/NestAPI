import { AuthGuard } from '@nestjs/passport'
import { ProductService } from './product.service'
import { HttpResponse } from '../../common/http-response.common'
import { ProductModel, ProductQuery, ProductSortType } from './product.interface'
import { Body, Controller, Get, Post, Query, Response, Headers, UseGuards } from '@nestjs/common'

@Controller('products')
export class ProductController {
	constructor(private readonly service: ProductService) { }

	@Post()
	@UseGuards(AuthGuard('jwt'))
	public async post(@Body() body: ProductModel): Promise<ProductModel> {
		return await this.service.create(body)
	}

	@Get()
	public async list(
		@Query() query: ProductQuery,
		@Headers() headers: { [header: string]: string },
		@Response() response: HttpResponse
	): Promise<void> {
		let sortType = ProductSortType[headers['sorttype']]
		sortType = sortType === undefined ? ProductSortType.CodeAsc : sortType

		let pageIndex = parseInt(headers['pageindex'])
		pageIndex = isNaN(pageIndex) ? 1 : pageIndex

		let pageSize = parseInt(headers['pagesize'])
		pageSize = isNaN(pageSize) ? 30 : pageSize

		const page = await this.service.list(query, sortType, pageIndex, pageSize)

		response
			.set('SortType', ProductSortType[sortType])
			.set('PageIndex', pageIndex.toString())
			.set('PageSize', pageSize.toString())
			.set('PageCount', page.pageCount.toString())
			.set('ItemCount', page.productCount.toString())
			.json(page.products)
	}
}