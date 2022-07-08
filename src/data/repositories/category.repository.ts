import { EntityRepository, Repository } from 'typeorm'
import { CategoryEntity } from '../entities/category.entity'

@EntityRepository(CategoryEntity)
export class CategoryRepository extends Repository<CategoryEntity> {
	public async findByUuid(uuid: string): Promise<CategoryEntity> {
		return await this.createQueryBuilder('cat').where('cat.uuid=:uuid', { uuid: uuid }).getOne()
	}

	public async findByCode(code: string): Promise<CategoryEntity> {
		return await this.createQueryBuilder('cat').where('cat.code=:code', { code: code }).getOne()
	}
}
