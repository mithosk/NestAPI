import { EntityRepository, Repository } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';

@EntityRepository(CategoryEntity)
export class CategopryRepository extends Repository<CategoryEntity> {
    public async findBy(code: string): Promise<CategoryEntity> {
        return await this.createQueryBuilder("cat")
            .where("cat.code=:code", { code: code })
            .getOne()
    }
}