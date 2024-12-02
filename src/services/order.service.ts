import { Order, OrderStatus, Prisma, PrismaClient, PaymentMethod } from '@prisma/client';
import { Pagination } from '../model/Pagination';
import { OrderCreateRequest, OrderPaymentRequest, OrderUpdateRequest } from '../model/Order';

const prisma = new PrismaClient();

export class OrderService {
    async createOrder(data: OrderCreateRequest): Promise<Order> {
        const orderItems: Prisma.OrderItemCreateManyOrderInput[] = [];

        if (data.orderItems) {
            for (const item of data.orderItems) {
                const product = await prisma.product.findFirst({
                    where: { id: item.productId }
                });

                orderItems.push({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: product?.price || 0
                });
            }
        }

        return prisma.order.create({
            include: {
                user: true,
                orderItems: true,
                payment: true
            },
            data: {
                totalAmount: orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
                status: 'PENDING',
                user: {
                    connect: {
                        id: data.userId
                    }
                },
                orderItems: {
                    create: orderItems
                }
            }
        });
    }

    async getOrders(limit: number, offset: number): Promise<Pagination<Order>> {
        const total = await prisma.order.count();

        const entries = await prisma.order.findMany({
            take: limit,
            skip: offset,
            include: {
                user: true,
                orderItems: true,
                payment: true
            }
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

    async updateOrder(id: number, data: OrderUpdateRequest): Promise<Order> {
        const orderItems: Prisma.OrderItemUncheckedCreateWithoutOrderInput[] = [];

        if (data.orderItems) {
            for (const item of data.orderItems) {
                const product = await prisma.product.findFirst({
                    where: { id: item.productId }
                });

                orderItems.push({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: product?.price || 0
                });
            }
        }

        return prisma.order.update({
            where: { id },
            include: {
                user: true,
                orderItems: true,
                payment: true
            },
            data: {
                totalAmount: orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
                orderItems: {
                    create: orderItems
                }
            }
        });
    }

    async deleteOrder(id: number): Promise<void> {
        await prisma.order.delete({
            where: { id }
        });
    }

    async payOrder(id: number, data: OrderPaymentRequest): Promise<Order> {
        let method: PaymentMethod = PaymentMethod.PAYPAL;

        switch (data.method.toUpperCase()) {
            case "PAYPAL": {
                method = PaymentMethod.PAYPAL;
                break;
            }

            case "CREDIT_CARD": {
                method = PaymentMethod.CREDIT_CARD;
                break;
            }

            case "BANK_TRANSFER": {
                method = PaymentMethod.BANK_TRANSFER;
                break;
            }
        }

        return prisma.order.update({
            where: { id },
            include: {
                user: true,
                orderItems: true,
                payment: true
            },
            data: {
                status: OrderStatus.COMPLETED,
                payment: {
                    create: {
                        amount: data.amount,
                        paymentMethod: method
                    }
                }
            }
        });
    }
}
