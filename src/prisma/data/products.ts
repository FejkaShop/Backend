import {PrismaClient} from "@prisma/client";

const entries = [
    {
        name: 'Smartphone',
        description: 'Latest model smartphone',
        price: 699.99,
        stock: 50,
        categoryId: 1,
        images: ['smartphone1.jpg', 'smartphone2.jpg'],
    },
    {
        name: 'T-shirt',
        description: 'Comfortable cotton T-shirt',
        price: 19.99,
        stock: 100,
        categoryId: 2,
        images: ['tshirt1.jpg', 'tshirt2.jpg'],
    }
];

async function insertEntries(prismaClient: PrismaClient) {
    for (const entry of entries) {
        await prismaClient.product.create({
            data: entry,
        });
    }
}

export default insertEntries;