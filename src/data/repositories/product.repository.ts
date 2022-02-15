import { ProductFilter } from '../filters/product.filter';
import { ProductEntity } from '../entities/product.entity';
import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';

@EntityRepository(ProductEntity)
export class ProductRepository extends Repository<ProductEntity> {
    public async findBy(filter: ProductFilter, skip?: number, take?: number): Promise<ProductEntity[]> {
        let query = this.createQueryBuilder("products")

        query = this.filterBy(query, filter)

        if (skip != null)
            query = query.skip(skip)

        if (take != null)
            query = query.take(take)

        return await query.getMany();
    }

    public async countBy(filter: ProductFilter): Promise<number> {
        let query = this.createQueryBuilder("products")

        query = this.filterBy(query, filter)

        return await query.getCount();
    }

    private filterBy(query: SelectQueryBuilder<ProductEntity>, filter: ProductFilter) {
        if (filter.text != null) {
            query = query
                .where("products.code LIKE :text OR products.description LIKE :text", { text: filter.text })
        }

        return query
    }
}