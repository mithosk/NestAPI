import { Controller, Get } from '@nestjs/common'
import { CategoryService } from './category.service'

@Controller('categories')
export class CategoryController {
    constructor(
        private readonly service: CategoryService
    ) { }

    @Get()
    public async hello(): Promise<string> {
        return 'hello'
    }
}