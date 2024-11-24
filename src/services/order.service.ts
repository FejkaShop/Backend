import { Order, Prisma, PrismaClient } from '@prisma/client';
import { Pagination } from '../model/Pagination';

const prisma = new PrismaClient();

export class OrderService {
    async createOrder(data: Prisma.OrderCreateInput): Promise<Order> {
        return prisma.order.create({
            data: data
        });
    }

    async getOrders(limit: number, offset: number): Promise<Pagination<Order>> {
        const total = await prisma.order.count();

        const entries = await prisma.order.findMany({
            take: limit,
            skip: offset
        });

        const hasMore: boolean = offset + limit < total;
        const pagination: Pagination<Order> = new Pagination<Order>(limit, offset, total, hasMore, entries);
        return new Promise((resolve) => resolve(pagination));
    }

    async getOrderById(id: number): Promise<Order | null> {
        return prisma.order.findUnique({
            where: { id }
        });
    }

    async updateOrder(id: number, data: Prisma.OrderUpdateInput): Promise<Order> {
        return prisma.order.update({
            where: { id },
            data: data
        });
    }

    async deleteOrder(id: number): Promise<void> {
        await prisma.order.delete({
            where: { id }
        });
    }
}