import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductModule } from './modules/product/product.module'
import { CategoryModule } from './modules/category/category.module'

@Module({
  imports: [
    CategoryModule,
    ProductModule,
    TypeOrmModule.forRoot()
  ]
})

export class AppModule { }