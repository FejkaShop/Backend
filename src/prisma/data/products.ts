import { PrismaClient } from '@prisma/client';

const entries = [
    {
        name: 'Smartphone',
        description: 'Latest model smartphone',
        price: 699.99,
        stock: 50,
        categoryId: 1,
        images: ['smartphone1.png', 'smartphone2.png']
    },
    {
        name: 'T-shirt',
        description: 'Comfortable cotton T-shirt',
        price: 19.99,
        stock: 100,
        categoryId: 2,
        images: ['tshirt1.png', 'tshirt2.png']
    }
];

async function insertEntries(prismaClient: PrismaClient) {
    for (const entry of entries) {
        await prismaClient.product.create({
            data: entry
        });
    }
}

export default insertEntries;
