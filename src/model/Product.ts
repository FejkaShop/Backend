import Joi from 'joi';
import { Category } from './Category';

export class Product {
    constructor(
        public id: number,
        public name: string,
        public description: string | null,
        public price: number,
        public stock: number,
        public categoryId: number,
        public images: string[],
        public createdAt: Date,
        public updatedAt: Date
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
