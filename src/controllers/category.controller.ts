import { Request, Response } from 'express';
import { Category } from '../model/Category';
import { Prisma } from '@prisma/client';
import PrismaClientKnownRequestError = Prisma.PrismaClientKnownRequestError;
import { CategoryService } from '../services/category.service';
import { Pagination } from '../model/Pagination';

const categoryService: CategoryService = new CategoryService();

export class CategoryController {
    async createCategory(req: Request, res: Response) {
        try {
            const { error, value } = Category.validate(req.body);

            if (error) {
                return res.status(400).json({ error: error.message });
            }

            const newCategory: Category = await categoryService.createCategory(value);
            res.status(201).json(newCategory);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to create category' });
        }
    }

    async getCategories(req: Request, res: Response) {
        try {
            const limit: number = parseInt(<string>req.query.limit) || 10;
            const offset: number = parseInt(<string>req.query.offset) || 0;

            const pagination: Pagination<Category> = await categoryService.getCategories(limit, offset);
            res.json(pagination);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch categories' });
        }
    }

    async getCategoryById(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const category = await categoryService.getCategoryById(parseInt(id));

            if (!category) {
                return res.status(404).json({ error: `Category with ID '${id}' not found` });
            }

            res.json(category);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch category' });
        }
    }

    async updateCategory(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const { error, value } = Category.validate(req.body);

            if (error) {
                return res.status(400).json({ error: error.message });
            }

            const updatedCategory: Category = await categoryService.updateCategory(parseInt(id), value);
            res.json(updatedCategory);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
                return res.status(404).json({ error: `Category with ID '${id}' not found` });
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
                    error: `Category with ID '${id}' not found`
                });
            }

            res.status(500).json({ error });
        }
    }
}
