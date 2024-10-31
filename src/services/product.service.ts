import { PrismaClient } from '@prisma/client';
import { Product } from '../model/Product';
import { Pagination } from '../model/Pagination';

const prisma: PrismaClient = new PrismaClient();

export class ProductService {
    async createProductFromObject(data: any): Promise<Product> {
        return prisma.product.create({
            data: data
        });
    }

    async createProduct(data: Product): Promise<Product> {
        return prisma.product.create({
            data: data
        });
    }

    async getProducts(limit: number, offset: number): Promise<Pagination<Product>> {
        const total: number = await prisma.product.count();

        const entries = await prisma.product.findMany({
            take: limit,
            skip: offset,
            include: {
                category: true
            }
        });

        const hasMore: boolean = offset + limit < total;
        const pagination: Pagination<Product> = new Pagination<Product>(limit, offset, total, hasMore, entries);
        return new Promise((resolve) => resolve(pagination));
    }

    async getProductById(id: number): Promise<Product | null> {
        return prisma.product.findUnique({
            where: { id },
            include: {
                category: true
            }
        });
    }

    async updateProduct(id: number, data: Partial<Product>): Promise<Product> {
        return prisma.product.update({
            where: { id },
            data: data
        });
    }

    async deleteProduct(id: number): Promise<void> {
        await prisma.product.delete({
            where: { id }
        });
    }
}
