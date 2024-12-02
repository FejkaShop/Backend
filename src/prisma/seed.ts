import { PrismaClient } from '@prisma/client';
import insertUsers from './data/users';
import insertCategories from './data/categories';
import insertProducts from './data/products';
import insertOrders from './data/orders';

const prisma = new PrismaClient();

async function main() {
    await insertUsers(prisma);
    await insertCategories(prisma);
    await insertProducts(prisma);
    await insertOrders(prisma);

    console.log('Data seeded successfully');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
