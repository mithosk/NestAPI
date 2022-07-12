import { CategoryModel } from './category.interface'
import { CategoryEntity } from '../../data/entities/category.entity'
import { CategoryRepository } from '../../data/repositories/category.repository'
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class CategoryService {
	constructor(private readonly categoryRepository: CategoryRepository) {}

	public async read(id: string): Promise<CategoryModel> {
		const entity = await this.categoryRepository.findByUuid(id)
		if (entity === undefined) throw new NotFoundException('category not found')

		return this.map(entity)
	}

	public async update(category: CategoryModel): Promise<CategoryModel> {
		const entityByUuid = await this.categoryRepository.findByUuid(category.id)
		if (entityByUuid === undefined) throw new NotFoundException('category not found')

		const entityByCode = await this.categoryRepository.findByCode(category.code)
		if (entityByCode !== undefined && entityByCode.uuid !== entityByUuid.uuid)
			throw new ForbiddenException('category code already used')

		entityByUuid.code = category.code
		entityByUuid.description = category.description
		await this.categoryRepository.save(entityByUuid)

		return this.map(entityByUuid)
	}

	private map(entity: CategoryEntity): CategoryModel {
		return {
			id: entity.uuid,
			code: entity.code,
			description: entity.description === null ? undefined : entity.description
		}
	}
}
