import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Clears the database by deleting data from all tables in a controlled order.
 */
export async function clearDatabase(): Promise<void> {
    // Clear tables in an order that respects foreign key constraints
    await prisma.orderItem.deleteMany({});
    await prisma.payment.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.address.deleteMany({});
    await prisma.user.deleteMany({});
}
