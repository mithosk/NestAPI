import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CategoryService } from './category.service'
import { CategoryController } from './category.controller'
import { CategoryRepository } from 'src/data/repositories/category.repository'

@Module({
  controllers: [CategoryController],
  providers: [CategoryService],
  imports: [TypeOrmModule.forFeature([
    CategoryRepository
  ])]
})

export class CategoryModule { }