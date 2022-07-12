import { AuthGuard } from '@nestjs/passport'
import { CategoryModel } from './category.interface'
import { CategoryService } from './category.service'
import { BadRequestException, Body, Controller, Param, Patch, UseGuards } from '@nestjs/common'

@Controller('categories')
export class CategoryController {
	constructor(private readonly service: CategoryService) { }

	@Patch(':id')
	@UseGuards(AuthGuard('jwt'))
	public async patch(@Param('id') id: string, @Body() body: Partial<CategoryModel>): Promise<CategoryModel> {
		const category = await this.service.read(id)

		//code
		if (body.code !== undefined) {
			if (body.code === null) throw new BadRequestException('code cannot be null')
			else if (typeof body.code !== 'string') throw new BadRequestException('code must be a string')
			else category.code = body.code
		}

		//description
		if (body.description !== undefined) {
			if (body.description !== null && typeof body.description !== 'string')
				throw new BadRequestException('description must be a string')
			else category.description = body.description
		}

		return await this.service.update(category)
	}
}