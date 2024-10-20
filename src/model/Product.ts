import Joi from 'joi';
import { Category } from './Category';

export class Product {
    constructor(
        id: number,
        name: string,
        description: string | null,
        price: number,
        stock: number,
        category: Category,
        images: string[],
        createdAt: Date,
        updatedAt: Date
    ) {}

    static validate(data: Partial<Product>): Joi.ValidationResult {
        const schema = Joi.object({
            name: Joi.string().min(1).required(),
            description: Joi.string().allow(null).optional(),
            price: Joi.number().positive().required(),
            stock: Joi.number().integer().min(0).required(),
            categoryId: Joi.number().integer().positive().required(),
            images: Joi.array().items(Joi.string()).optional(),
            createdAt: Joi.date().optional(),
            updatedAt: Joi.date().optional()
        });

        return schema.validate(data);
    }
}
