import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class ProductModel {
    id: string

    @IsNotEmpty()
    code: string

    @IsNotEmpty()
    description: string

    categoryId: string

    @IsNotEmpty()
    categoryCode: string

    @IsNotEmpty()
    price: number
}

export class ProductQuery {
    @IsString()
    @IsOptional()
    text: string
}

export enum ProductSortType {
    CodeAsc = 0,
    CodeDesc = 1,
    PriceAsc = 2,
    PriceDesc = 3
}