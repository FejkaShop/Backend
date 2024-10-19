import {PrismaClient} from "@prisma/client";

const entries = [
    {
        name: 'Electronics',
        description: 'Devices and gadgets',
    },
    {
        name: 'Clothing',
        description: 'Apparel and accessories',
    }
];

async function insertEntries(prismaClient: PrismaClient) {
    for (const entry of entries) {
        await prismaClient.category.create({
            data: entry,
        });
    }
}

export default insertEntries;