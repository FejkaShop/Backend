import { Prisma, PrismaClient, Review } from '@prisma/client';
import { Pagination } from '../model/Pagination';

const prisma: PrismaClient = new PrismaClient();

export class ReviewService {
    async createReview(data: Prisma.ReviewUncheckedCreateInput): Promise<Review> {
        return prisma.review.create({
            data: data
        });
    }

    async getReviews(limit: number, offset: number): Promise<Pagination<Review>> {
        const total: number = await prisma.review.count();

        const entries = await prisma.review.findMany({
            take: limit,
            skip: offset,
            include: {
                product: true,
                user: true
            }
        });

        const hasMore: boolean = offset + limit < total;
        const pagination: Pagination<Review> = new Pagination<Review>(limit, offset, total, hasMore, entries);
        return new Promise((resolve) => resolve(pagination));
    }

    async getReviewById(id: number): Promise<Review | null> {
        return prisma.review.findUnique({
            where: { id },
            include: {
                product: true,
                user: true
            }
        });
    }
    async getReviewsByProductId(productId: number, limit: number, offset: number):Promise<Pagination<Review>>{
        const total: number = await prisma.review.count({ where: { productId } });
        const entries =  await prisma.review.findMany({
            take: limit,
            skip: offset,
            where: { productId },
            include: {
                product: true,
                user: true
            }
        });
        const hasMore: boolean = offset + limit < total;
        const pagination: Pagination<Review> = new Pagination<Review>(limit, offset, total, hasMore, entries);
        return new Promise((resolve) => resolve(pagination));
    }
}
