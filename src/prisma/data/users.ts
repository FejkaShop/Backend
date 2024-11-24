import { PrismaClient, UserRole } from '@prisma/client';

const entries = [
    {
        email: 'customer@example.com',
        password: 'securepassword',
        name: 'John Doe',
        role: UserRole.CUSTOMER,
        address: {
            create: {
                street: '123 Main St',
                city: 'Anytown',
                state: 'CA',
                country: 'USA',
                postalCode: '12345'
            }
        }
    },
    {
        email: 'admin@example.com',
        password: 'securepassword',
        name: 'Admin User',
        role: UserRole.ADMIN
    }
];

async function insertEntries(prismaClient: PrismaClient) {
    for (const entry of entries) {
        await prismaClient.user.create({
            data: entry
        });
    }
}

export default insertEntries;
