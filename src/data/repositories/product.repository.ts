import { ProductFilter } from '../filters/product.filter'
import { ProductEntity } from '../entities/product.entity'
import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm'

@EntityRepository(ProductEntity)
export class ProductRepository extends Repository<ProductEntity> {
    public async findByCode(code: string): Promise<ProductEntity> {
        return await this.createQueryBuilder("pro")
            .where("pro.code=:code", { code: code })
            .getOne()
    }

    public async findByFilter(filter: ProductFilter, skip?: number, take?: number): Promise<ProductEntity[]> {
        let query = this.createQueryBuilder("pro")
            .leftJoinAndSelect("pro.category", "cat")

        query = this.applyFilter(query, filter)

        if (skip != null)
            query = query.skip(skip)

        if (take != null)
            query = query.take(take)

        return await query.getMany();
    }

    public async countByFilter(filter: ProductFilter): Promise<number> {
        let query = this.createQueryBuilder("pro")

        query = this.applyFilter(query, filter)

        return await query.getCount();
    }

    private applyFilter(query: SelectQueryBuilder<ProductEntity>, filter: ProductFilter) {
        if (filter.text != null) {
            query = query
                .where("pro.code LIKE :text OR pro.description LIKE :text", { text: filter.text })
        }

        return query
    }
}