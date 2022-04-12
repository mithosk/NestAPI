import { CategoryModel } from './category.interface'
import { CategoryRepository } from '../../data/repositories/category.repository'
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class CategoryService {
    constructor(
        private readonly categoryRepository: CategoryRepository
    ) { }

    public async read(id: string): Promise<CategoryModel> {
        let entity = await this.categoryRepository.findByUuid(id)
        if (entity === undefined)
            throw new NotFoundException('category not found')

        return {
            id: entity.uuid,
            code: entity.code,
            description: entity.description
        }
    }

    public async update(category: CategoryModel): Promise<CategoryModel> {
        let entity = await this.categoryRepository.findByCode(category.code)
        if (entity !== undefined && entity.uuid !== category.id)
            throw new ForbiddenException('category code already used')

        entity = await this.categoryRepository.findByUuid(category.id)
        if (entity === undefined)
            throw new NotFoundException('category not found')

        entity.code = category.code
        entity.description = category.description
        await this.categoryRepository.save(entity)

        return {
            id: entity.uuid,
            code: entity.code,
            description: entity.description
        }
    }
}