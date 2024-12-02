import { OrderStatus, PrismaClient } from '@prisma/client';

const entries = [
    {
        userId: 1,
        totalAmount: 1399.98,
        status: OrderStatus.PENDING,
        createdAt: '2024-11-25T15:14:21.194Z',
        updatedAt: '2024-11-25T15:14:21.194Z',
        orderItems: {
            create: [
                {
                    productId: 1,
                    quantity: 2,
                    price: 699.99
                }
            ]
        }
    }
];

async function insertEntries(prismaClient: PrismaClient) {
    for (const entry of entries) {
        await prismaClient.order.create({
            data: entry
        });
    }
}

export default insertEntries;
