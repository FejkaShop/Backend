import { UserRole } from '../../model/User';
import { PrismaClient } from '@prisma/client';

const entries = [
    {
        email: 'customer@example.com',
        password: 'securepassword',
        name: 'John Doe',
        role: UserRole.CUSTOMER,
        Address: {
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
        password: 'securepassword', // You might want to hash this in a real app
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
