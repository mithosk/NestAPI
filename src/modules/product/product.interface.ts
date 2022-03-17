import { IsNotEmpty } from 'class-validator'

export class ProductModel {
    @IsNotEmpty()
    code: string

    @IsNotEmpty()
    categoryCode: string

    @IsNotEmpty()
    description: string

    @IsNotEmpty()
    price: number
}

export interface ProductQuery {
    text: string
}

export enum ProductSortType {
    CodeAsc = 0,
    CodeDesc = 1,
    PriceAsc = 2,
    PriceDesc = 3
}