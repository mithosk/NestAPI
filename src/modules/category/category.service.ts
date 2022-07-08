import { CategoryModel } from './category.interface'
import { CategoryRepository } from '../../data/repositories/category.repository'
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class CategoryService {
	constructor(private readonly categoryRepository: CategoryRepository) {}

	public async read(id: string): Promise<CategoryModel> {
		const entity = await this.categoryRepository.findByUuid(id)
		if (entity === undefined) throw new NotFoundException('category not found')

		return {
			id: entity.uuid,
			code: entity.code,
			description: entity.description
		}
	}

	public async update(category: CategoryModel): Promise<CategoryModel> {
		let entityByUuid = await this.categoryRepository.findByUuid(category.id)
		if (entityByUuid === undefined) throw new NotFoundException('category not found')

		let entityByCode = await this.categoryRepository.findByCode(category.code)
		if (entityByCode !== undefined && entityByCode.uuid !== entityByUuid.uuid)
			throw new ForbiddenException('category code already used')

		entityByUuid.code = category.code
		entityByUuid.description = category.description
		await this.categoryRepository.save(entityByUuid)

		return {
			id: entityByUuid.uuid,
			code: entityByUuid.code,
			description: entityByUuid.description
		}
	}
}
