import { Prisma, PrismaClient, User } from '@prisma/client';
import { Pagination } from '../model/Pagination';

const prisma = new PrismaClient();

export class UserService {
    async createUser(data: Prisma.UserCreateInput): Promise<User> {
        return prisma.user.create({
            data: data
        });
    }

    async getUsers(limit: number, offset: number): Promise<Pagination<User>> {
        const total = await prisma.user.count();

        const entries = await prisma.user.findMany({
            take: limit,
            skip: offset
        });

        const hasMore: boolean = offset + limit < total;
        const pagination: Pagination<User> = new Pagination<User>(limit, offset, total, hasMore, entries);
        return new Promise((resolve) => resolve(pagination));
    }

    async getUserById(id: number): Promise<User | null> {
        return prisma.user.findUnique({
            where: { id }
        });
    }

    async updateUser(id: number, data: Prisma.UserUpdateInput): Promise<User> {
        return prisma.user.update({
            where: { id },
            data: data
        });
    }

    async deleteUser(id: number): Promise<void> {
        await prisma.user.delete({
            where: { id }
        });
    }
}
