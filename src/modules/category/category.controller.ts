import { AuthGuard } from '@nestjs/passport'
import { CategoryModel } from './category.interface'
import { CategoryService } from './category.service'
import { Body, Controller, ForbiddenException, Param, Patch, UseGuards } from '@nestjs/common'

@Controller('categories')
export class CategoryController {
    constructor(
        private readonly service: CategoryService
    ) { }

    @Patch(':id')
    @UseGuards(AuthGuard('jwt'))
    public async patch(@Param('id') id: string, @Body() body: any): Promise<CategoryModel> {
        let category = await this.service.read(id)

        //code
        if (body.code !== undefined)
            if (body.code === null)
                throw new ForbiddenException('code cannot be null')
            else
                category.code = body.code.toString()


        //description
        if (body.description !== undefined)
            category.description = body.description === null ? null : body.description.toString()

        return await this.service.update(category)
    }
}