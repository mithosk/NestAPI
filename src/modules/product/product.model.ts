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