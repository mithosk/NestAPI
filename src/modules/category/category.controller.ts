import { AuthGuard } from '@nestjs/passport'
import { CategoryModel } from './category.interface'
import { CategoryService } from './category.service'
import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common'

@Controller('categories')
export class CategoryController {
    constructor(
        private readonly service: CategoryService
    ) { }

    @Patch(':id')
    @UseGuards(AuthGuard('jwt'))
    public async patch(@Param('id') id: string, @Body() body: any): Promise<CategoryModel> {
        let category = await this.service.read(id)

        if (body.code !== undefined)
            category.code = body.code.toString()

        if (body.description !== undefined)
            category.description = body.description.toString()

        return await this.service.update(category)
    }
}