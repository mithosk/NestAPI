import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './modules/auth/auth.module'
import { ProductModule } from './modules/product/product.module'
import { CategoryModule } from './modules/category/category.module'

@Module({
	imports: [AuthModule, CategoryModule, ProductModule, TypeOrmModule.forRoot()]
})
export class AppModule {}
