import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductRepository } from 'src/data/repositories/product.repository';
import { CategoryRepository } from 'src/data/repositories/category.repository';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [TypeOrmModule.forFeature([
    CategoryRepository,
    ProductRepository
  ])]
})

export class ProductModule { }