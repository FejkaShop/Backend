import Joi from 'joi';

export class Category {
    constructor(
        public id: number,
        public name: string,
        public description: string | null
    ) {}

    static validate(data: Partial<Category>): Joi.ValidationResult {
        const schema = Joi.object({
            name: Joi.string().min(1).required(),
            description: Joi.string().allow(null).optional()
        });

        return schema.validate(data);
    }
}
