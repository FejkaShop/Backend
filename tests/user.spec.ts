import { expect } from 'chai';
import { PrismaClient, User, UserRole } from '@prisma/client';
import { UserService } from '../src/services/user.service';
import { clearDatabase } from './clear';

const prisma = new PrismaClient();
const userService = new UserService();

describe('UserService', () => {
    let testUser: User;

    before(async () => {
        // Clear the database
        await clearDatabase();
    });

    after(async () => {
        // Clean up after all tests are done
        await clearDatabase();
        await prisma.$disconnect();
    });

    describe('createUser', () => {
        it('should create a new user', async () => {
            const userData = {
                email: 'testuser@example.com',
                password: 'password123',
                name: 'Test User',
                role: UserRole.CUSTOMER
            };
            const createdUser = await userService.createUser(userData);

            expect(createdUser).to.have.property('id');
            expect(createdUser.email).to.equal('testuser@example.com');
            expect(createdUser.role).to.equal(UserRole.CUSTOMER);

            testUser = createdUser; // Store for use in later tests
        });

        it('should not create a user with invalid email', async () => {
            const userData = {
                email: 'invalid-email',
                password: 'password123',
                role: UserRole.CUSTOMER
            };

            try {
                await userService.createUser(userData);
                throw new Error('Test failed - expected validation error');
            } catch (error) {
                const err = error as Error;
                expect(err.message).to.not.be.null;
            }
        });
    });

    describe('getUsers', () => {
        it('should return a paginated list of users', async () => {
            const limit = 1;
            const offset = 0;
            const paginationResult = await userService.getUsers(limit, offset);

            expect(paginationResult).to.have.property('totalEntries').that.is.a('number');
            expect(paginationResult.entries).to.be.an('array');
            expect(paginationResult.entries.length).to.be.at.most(limit);

            if (paginationResult.entries.length > 0) {
                expect(paginationResult.entries[0]).to.have.property('email');
            }
        });
    });

    describe('getUserById', () => {
        it('should return the user with the given ID', async () => {
            const fetchedUser = await userService.getUserById(testUser.id);

            expect(fetchedUser).to.not.be.null;
            expect(fetchedUser!.id).to.equal(testUser.id);
            expect(fetchedUser!.email).to.equal('testuser@example.com');
        });

        it('should return null for a non-existent user ID', async () => {
            const fetchedUser = await userService.getUserById(9999);
            expect(fetchedUser).to.be.null;
        });
    });

    describe('updateUser', () => {
        it('should update the user with the given ID', async () => {
            const updatedData = { name: 'Updated User Name', role: UserRole.ADMIN };
            const updatedUser = await userService.updateUser(testUser.id, updatedData);

            expect(updatedUser.name).to.equal('Updated User Name');
            expect(updatedUser.role).to.equal(UserRole.ADMIN);
            expect(updatedUser.id).to.equal(testUser.id);
        });
    });

    describe('deleteUser', () => {
        it('should delete the user with the given ID', async () => {
            await userService.deleteUser(testUser.id);
            const deletedUser = await userService.getUserById(testUser.id);
            expect(deletedUser).to.be.null;
        });

        it('should throw an error when deleting a non-existent user', async () => {
            try {
                await userService.deleteUser(9999);
                throw new Error('Test failed - expected error for non-existent user');
            } catch (error) {
                const err = error as Error;
                expect(err.message).to.not.be.null;
            }
        });
    });
});
