import { Request, Response } from 'express';
import { Prisma, Product } from '@prisma/client';
import { ProductService } from '../services/product.service';
import Joi from 'joi';
import PrismaClientKnownRequestError = Prisma.PrismaClientKnownRequestError;

const productService: ProductService = new ProductService();

function validate(data: Partial<Product>): Joi.ValidationResult {
    const schema = Joi.object({
        name: Joi.string().min(1).required(),
        description: Joi.string().optional(),
        price: Joi.number().positive().required(),
        stock: Joi.number().integer().min(0).required(),
        categoryId: Joi.number().integer().positive().required(),
        images: Joi.array().items(Joi.string()).optional(),
        createdAt: Joi.date().optional(),
        updatedAt: Joi.date().optional()
    });

    return schema.validate(data);
}

export class ProductController {
    public async createProduct(req: Request, res: Response) {
        try {
            const { error, value } = validate(req.body);

            if (error) {
                return res.status(400).json({ error: error.message });
            }

            const newEntry = await productService.createProduct(value);
            res.status(201).json(newEntry);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to create product' });
        }
    }

    public async getProducts(req: Request, res: Response) {
        try {
            const limit: number = parseInt(<string>req.query.limit) || 10;
            const offset: number = parseInt(<string>req.query.offset) || 0;

            const pagination = await productService.getProducts(limit, offset);
            res.json(pagination);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch products' });
        }
    }

    public async getProductById(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const entry = await productService.getProductById(parseInt(id));

            if (!entry) {
                return res.status(404).json({ error: `Entry with ID '${id}' not found` });
            }

            res.json(entry);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch product' });
        }
    }

    async updateProduct(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const { error, value } = validate(req.body);

            if (error) {
                return res.status(400).json({ error: error.message });
            }

            const updatedProduct = await productService.updateProduct(parseInt(id), value);
            res.json(updatedProduct);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
                return res.status(404).json({ error: `Entry with ID '${id}' not found` });
            }

            res.status(500).json({ error });
        }
    }

    async deleteProduct(req: Request, res: Response) {
        const { id } = req.params;

        try {
            await productService.deleteProduct(parseInt(id));

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
