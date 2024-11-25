import { expect } from 'chai';
import { PrismaClient, Order, User, Product } from '@prisma/client';
import { OrderService } from '../src/services/order.service';
import { clearDatabase } from './clear';

const prisma = new PrismaClient();
const orderService = new OrderService();

describe('OrderService', () => {
    let testUser: User;
    let testProduct: Product;
    let testOrder: Order;

    before(async () => {
        // Clear database
        await clearDatabase();

        // Create test user and product
        testUser = await prisma.user.create({
            data: { email: 'testuser@example.com', password: 'password', role: 'CUSTOMER' }
        });

        const testCategory = await prisma.category.create({
            data: { name: 'Test Category' }
        });

        testProduct = await prisma.product.create({
            data: {
                name: 'Test Product',
                price: 100,
                stock: 10,
                categoryId: testCategory.id
            }
        });
    });

    after(async () => {
        // Clean up
        await clearDatabase();
        await prisma.$disconnect();
    });

    describe('createOrder', () => {
        it('should create a new order with valid data', async () => {
            const orderData = {
                userId: testUser.id,
                orderItems: [
                    { productId: testProduct.id, quantity: 2 }
                ]
            };

            const createdOrder = await orderService.createOrder(orderData);
            expect(createdOrder).to.have.property('id');
            expect(createdOrder.userId).to.equal(testUser.id);
            expect(createdOrder.totalAmount).to.equal(200); // 2 items * 100 price
            // expect(createdOrder.orderItems).to.be.an('array').that.is.not.empty;

            testOrder = createdOrder; // Save for later tests
        });

        it('should calculate totalAmount as 0 if no order items are provided', async () => {
            const orderData = {
                userId: testUser.id,
                orderItems: [] // Empty order items
            };

            const createdOrder = await orderService.createOrder(orderData);
            expect(createdOrder.totalAmount).to.equal(0);
        });

        it('should throw an error if the product does not exist', async () => {
            const invalidOrderData = {
                userId: testUser.id,
                orderItems: [{ productId: 9999, quantity: 1 }] // Invalid product ID
            };

            try {
                await orderService.createOrder(invalidOrderData);
                throw new Error('Expected an error to be thrown');
            } catch (error: any) {
                expect(error.message).to.not.be.null;
            }
        });
    });

    describe('getOrders', () => {
        it('should return paginated orders', async () => {
            const pagination = await orderService.getOrders(1, 0);

            expect(pagination).to.have.property('totalEntries').that.is.a('number');
            expect(pagination.entries).to.be.an('array');
            expect(pagination.entries.length).to.be.at.most(1);

            if (pagination.entries.length > 0) {
                expect(pagination.entries[0]).to.have.property('user');
                expect(pagination.entries[0]).to.have.property('orderItems');
            }
        });
    });

    describe('getOrderById', () => {
        it('should return the order with the given ID', async () => {
            const fetchedOrder = await orderService.getOrderById(testOrder.id);

            expect(fetchedOrder).to.not.be.null;
            expect(fetchedOrder!.id).to.equal(testOrder.id);
            expect(fetchedOrder!.userId).to.equal(testUser.id);
        });

        it('should return null for a non-existent order ID', async () => {
            const fetchedOrder = await orderService.getOrderById(9999);
            expect(fetchedOrder).to.be.null;
        });
    });

    describe('updateOrder', () => {
        it('should update the order with the given ID', async () => {
            const updateData = {
                orderItems: [
                    { productId: testProduct.id, quantity: 3 } // Update quantity
                ]
            };

            const updatedOrder = await orderService.updateOrder(testOrder.id, updateData);

            expect(updatedOrder.totalAmount).to.equal(300); // 3 items * 100 price
            // expect(updatedOrder.orderItems[0].quantity).to.equal(3);
        });

        it('should throw an error if the order ID does not exist', async () => {
            const invalidUpdateData = { orderItems: [] };

            try {
                await orderService.updateOrder(9999, invalidUpdateData);
                throw new Error('Expected an error to be thrown');
            } catch (error: any) {
                expect(error.message).to.include('Record to update not found');
            }
        });
    });

    describe('deleteOrder', () => {
        it('should delete the order with the given ID', async () => {
            await orderService.deleteOrder(testOrder.id);
            const deletedOrder = await orderService.getOrderById(testOrder.id);
            expect(deletedOrder).to.be.null;
        });

        it('should throw an error if the order ID does not exist', async () => {
            try {
                await orderService.deleteOrder(9999);
                throw new Error('Expected an error to be thrown');
            } catch (error: any) {
                expect(error.message).to.include('Record to delete does not exist');
            }
        });
    });
});
