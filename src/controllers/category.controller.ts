import { Request, Response } from 'express';
import { Category, Prisma } from '@prisma/client';
import { CategoryService } from '../services/category.service';
import Joi from 'joi';
import PrismaClientKnownRequestError = Prisma.PrismaClientKnownRequestError;

const categoryService: CategoryService = new CategoryService();

function validate(data: Partial<Category>): Joi.ValidationResult {
    const schema = Joi.object({
        name: Joi.string().min(1).required(),
        description: Joi.string().allow(null).optional()
    });

    return schema.validate(data);
}

export class CategoryController {
    async createCategory(req: Request, res: Response) {
        try {
            const { error, value } = validate(req.body);

            if (error) {
                return res.status(400).json({ error: error.message });
            }

            const newEntry = await categoryService.createCategory(value);
            res.status(201).json(newEntry);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to create category' });
        }
    }

    async getCategories(req: Request, res: Response) {
        try {
            const limit: number = parseInt(<string>req.query.limit) || 10;
            const offset: number = parseInt(<string>req.query.offset) || 0;

            const pagination = await categoryService.getCategories(limit, offset);
            res.json(pagination);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch categories' });
        }
    }

    async getCategoryById(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const entry = await categoryService.getCategoryById(parseInt(id));

            if (!entry) {
                return res.status(404).json({ error: `Entry with ID '${id}' not found` });
            }

            res.json(entry);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch category' });
        }
    }

    async updateCategory(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const { error, value } = validate(req.body);

            if (error) {
                return res.status(400).json({ error: error.message });
            }

            const updatedEntry = await categoryService.updateCategory(parseInt(id), value);
            res.json(updatedEntry);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
                return res.status(404).json({ error: `Entry with ID '${id}' not found` });
            }

            res.status(500).json({ error });
        }
    }

    async deleteCategory(req: Request, res: Response) {
        const { id } = req.params;

        try {
            await categoryService.deleteCategory(parseInt(id));

            res.status(204).send();
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
                return res.status(404).json({
                    error: `Entry with ID '${id}' not found`
                });
            }

            res.status(500).json({ error });
        }
    }
}
