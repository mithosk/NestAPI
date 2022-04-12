import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class ProductModel {
    id: string

    @IsString()
    @IsNotEmpty()
    code: string

    @IsString()
    @IsNotEmpty()
    description: string

    categoryId: string

    @IsString()
    @IsNotEmpty()
    categoryCode: string

    @IsNumber()
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