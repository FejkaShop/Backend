import { Request, Response } from 'express';
import { Product } from '../model/Product';
import { Prisma } from '@prisma/client';
import PrismaClientKnownRequestError = Prisma.PrismaClientKnownRequestError;
import { ProductService } from '../services/product.service';
import { Pagination } from '../model/Pagination';

const productService: ProductService = new ProductService();

export class ProductController {
    public async createProduct(req: Request, res: Response) {
        try {
            const { error, value } = Product.validate(req.body);

            if (error) {
                return res.status(400).json({ error: error.message });
            }

            const newProduct: Product = await productService.createProduct(value);
            res.status(201).json(newProduct);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to create product' });
        }
    }

    public async getProducts(req: Request, res: Response) {
        try {
            const limit: number = parseInt(<string>req.query.limit) || 10;
            const offset: number = parseInt(<string>req.query.offset) || 0;

            const pagination: Pagination<Product> = await productService.getProducts(limit, offset);
            res.json(pagination);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch products' });
        }
    }

    public async getProductById(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const product: Product | null = await productService.getProductById(parseInt(id));

            if (!product) {
                return res.status(404).json({ error: `Product with ID '${id}' not found` });
            }

            res.json(product);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch product' });
        }
    }

    async updateProduct(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const { error, value } = Product.validate(req.body);

            if (error) {
                return res.status(400).json({ error: error.message });
            }

            const updatedProduct: Product = await productService.updateProduct(parseInt(id), value);
            res.json(updatedProduct);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
                return res.status(404).json({ error: `Product with ID '${id}' not found` });
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
                    error: `Product with ID '${id}' not found`
                });
            }

            res.status(500).json({ error });
        }
    }
}
