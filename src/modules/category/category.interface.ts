import { IsNotEmpty } from 'class-validator'

export class CategoryModel {
    id: string

    @IsNotEmpty()
    code: string

    description: string
}