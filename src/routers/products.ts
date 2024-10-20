import { Request, Response, Router } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';
import { Pagination } from '../model/Pagination';
import { Product } from '../model/Product';
import PrismaClientKnownRequestError = Prisma.PrismaClientKnownRequestError;

const prisma: PrismaClient = new PrismaClient();
const router: Router = Router();

router.post('/', async (req: Request, res: Response) => {
    try {
        const { error, value } = Product.validate(req.body);

        if (error) {
            res.status(400).json({ error: error.message });
            return;
        }

        const newProduct: Product = await prisma.product.create({
            data: {
                id: value.id || undefined,
                name: value.name,
                description: value.description,
                price: value.price,
                stock: value.stock,
                categoryId: value.categoryId,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });

        res.status(201).json(newProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create product' });
    }
});

router.get('/', async (req: Request, res: Response) => {
    try {
        const limit: number = parseInt(<string>req.query.limit) || 10;
        const offset: number = parseInt(<string>req.query.offset) || 0;

        const total: number = await prisma.product.count();
        let entries: Product[] = await prisma.product.findMany({
            take: limit,
            skip: offset,
            include: {
                category: true
            }
        });

        const pagination: Pagination<Product> = {
            limit: limit,
            offset: offset,
            totalEntries: total,
            hasMoreEntries: offset + limit < total,
            entries: entries
        };

        res.json(pagination);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const product: Product | null = await prisma.product.findUnique({
            where: { id: parseInt(id) },
            include: {
                category: true
            }
        });

        if (!product) {
            res.status(404).json({
                error: `Product with ID '${id}' not found`
            });
            return;
        }

        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

router.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const { error, value } = Product.validate(req.body);

        if (error) {
            res.status(400).json({ error: error.message });
            return;
        }

        const updatedProduct = await prisma.product.update({
            where: { id: parseInt(id) },
            data: {
                name: value.name,
                description: value.description,
                price: value.price,
                stock: value.stock,
                categoryId: value.categoryId,
                updatedAt: new Date()
            }
        });

        res.json(updatedProduct);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                res.status(404).json({
                    error: `Product with ID '${id}' not found`
                });
                return;
            }
        }

        res.status(500).json({ error: error });
    }
});

router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await prisma.product.delete({
            where: { id: parseInt(id) }
        });

        res.status(204).send();
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                res.status(404).json({
                    error: `Product with ID '${id}' not found`
                });
                return;
            }
        }

        res.status(500).json({ error: error });
    }
});

export default router;
