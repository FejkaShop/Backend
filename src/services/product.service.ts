import { Prisma, PrismaClient, Product } from '@prisma/client';
import { Pagination } from '../model/Pagination';

const prisma: PrismaClient = new PrismaClient();

export class ProductService {
    async createProduct(data: Prisma.ProductUncheckedCreateInput): Promise<Product> {
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

        const url = process.env.SERVER_URL || 'http://localhost:3000';

        entries.forEach((product) => {
            product.images = product.images.map((image) => `${url}/images/${image}`);
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

    async updateProduct(id: number, data: Prisma.ProductUpdateInput): Promise<Product> {
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
