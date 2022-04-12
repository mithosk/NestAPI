import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CategoryModel {
    id: string

    @IsString()
    @IsNotEmpty()
    code: string

    @IsString()
    @IsOptional()
    description: string
}