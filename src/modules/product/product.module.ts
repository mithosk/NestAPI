import { Module } from '@nestjs/common'
import { ProductBus } from './product.bus'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductService } from './product.service'
import { ProductGateway } from './product.gateway'
import { ProductController } from './product.controller'
import { ProductRepository } from '../../data/repositories/product.repository'
import { CategoryRepository } from '../../data/repositories/category.repository'

@Module({
	controllers: [ProductController],
	providers: [ProductService, ProductGateway, ProductBus],
	imports: [TypeOrmModule.forFeature([CategoryRepository, ProductRepository])]
})
export class ProductModule { }