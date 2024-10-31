import { PrismaClient } from '@prisma/client';
import { Category } from '../model/Category';
import { Pagination } from '../model/Pagination';

const prisma: PrismaClient = new PrismaClient();

export class CategoryService {
    async createCategoryFromObject(data: any): Promise<Category> {
        return prisma.category.create({
            data: data
        });
    }

    async createCategory(data: Category): Promise<Category> {
        return prisma.category.create({
            data: data
        });
    }

    async getCategories(limit: number, offset: number): Promise<Pagination<Category>> {
        const total: number = await prisma.category.count();

        const entries = await prisma.category.findMany({
            take: limit,
            skip: offset
        });

        const hasMore: boolean = offset + limit < total;
        const pagination: Pagination<Category> = new Pagination<Category>(limit, offset, total, hasMore, entries);
        return new Promise((resolve) => resolve(pagination));
    }

    async getCategoryById(id: number): Promise<Category | null> {
        return prisma.category.findUnique({
            where: { id }
        });
    }

    async updateCategory(id: number, data: Partial<Category>): Promise<Category> {
        return prisma.category.update({
            where: { id },
            data: data
        });
    }

    async deleteCategory(id: number): Promise<void> {
        await prisma.category.delete({
            where: { id }
        });
    }
}
