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
	public async patch(@Param('id') id: string, @Body() body: Partial<CategoryModel>): Promise<CategoryModel> {
		const category = await this.service.read(id)

		//code
		if (body.code !== undefined) {
			if (body.code === null)
				throw new ForbiddenException('code cannot be null')
			else if (typeof body.code !== 'string')
				throw new ForbiddenException('code must be a string')
			else
				category.code = body.code
		}

		//description
		if (body.description !== undefined) {
			if (body.description !== null && typeof body.description !== 'string')
				throw new ForbiddenException('description must be a string')
			else
				category.description = body.description
		}

		return await this.service.update(category)
	}
}