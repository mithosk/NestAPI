import { join } from 'path'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './modules/auth/auth.module'
import { ServeStaticModule } from '@nestjs/serve-static'
import { ProductModule } from './modules/product/product.module'
import { CategoryModule } from './modules/category/category.module'

@Module({
	imports: [
		AuthModule,
		CategoryModule,
		ProductModule,
		TypeOrmModule.forRoot(),
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', 'public')
		})
	]
})
export class AppModule {}
