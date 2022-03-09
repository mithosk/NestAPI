import { ProductFilter } from '../filters/product.filter'
import { ProductEntity } from '../entities/product.entity'
import { InternalServerErrorException } from '@nestjs/common'
import { ProductSort } from '../../modules/product/product.query'
import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm'

@EntityRepository(ProductEntity)
export class ProductRepository extends Repository<ProductEntity> {
    public async findByCode(code: string): Promise<ProductEntity> {
        return await this.createQueryBuilder("pro")
            .where("pro.code=:code", { code: code })
            .getOne()
    }

    public async findByFilter(filter: ProductFilter, sort?: ProductSort, skip?: number, take?: number): Promise<ProductEntity[]> {
        let query = this.createQueryBuilder("pro")
            .leftJoinAndSelect("pro.category", "cat")

        query = this.applyFilter(query, filter)

        if (sort !== undefined)
            switch (sort) {
                case ProductSort.CodeAsc:
                    query = query.orderBy('pro.code', 'ASC')
                    break

                case ProductSort.CodeDesc:
                    query = query.orderBy('pro.code', 'DESC')
                    break

                case ProductSort.PriceAsc:
                    query = query.orderBy('pro.price', 'ASC')
                    break

                case ProductSort.PriceDesc:
                    query = query.orderBy('pro.price', 'DESC')
                    break

                default:
                    throw new InternalServerErrorException('unmanaged sorting')
            }

        if (skip !== undefined)
            query = query.skip(skip)

        if (take !== undefined)
            query = query.take(take)

        return await query.getMany();
    }

    public async countByFilter(filter: ProductFilter): Promise<number> {
        let query = this.createQueryBuilder("pro")

        query = this.applyFilter(query, filter)

        return await query.getCount();
    }

    private applyFilter(query: SelectQueryBuilder<ProductEntity>, filter: ProductFilter) {
        if (filter.text !== undefined) {
            query = query
                .where("pro.code LIKE :text OR pro.description LIKE :text", { text: "%" + filter.text + "%" })
        }

        return query
    }
}