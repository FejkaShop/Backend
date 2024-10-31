import { expect } from 'chai';
import { PrismaClient } from '@prisma/client';
import { ProductService } from '../src/services/product.service';
import { Product } from '../src/model/Product';
import { CategoryService } from '../src/services/category.service';

const prisma = new PrismaClient();
const productService = new ProductService();
const categoryService = new CategoryService();

describe('ProductService', () => {
    let testProduct: Product;
    let testCategoryId: number;

    before(async () => {
        // Clear the database and create a category to associate with products
        await prisma.product.deleteMany({});
        await prisma.category.deleteMany({});

        const category = await prisma.category.create({
            data: { name: 'Test Category', description: 'Test Description' }
        });
        testCategoryId = category.id;
    });

    after(async () => {
        // Clean up after all tests are done
        await prisma.product.deleteMany({});
        await prisma.category.deleteMany({});
        await prisma.$disconnect();
    });

    describe('createProduct', () => {
        it('should create a new product', async () => {
            const productData = {
                name: 'Test Product',
                description: 'Product Description',
                price: 100,
                categoryId: testCategoryId,
                stock: 10
            };
            const createdProduct = await productService.createProductFromObject(productData);

            expect(createdProduct).to.have.property('id');
            expect(createdProduct.name).to.equal('Test Product');
            expect(createdProduct.price).to.equal(100);
            expect(createdProduct.categoryId).to.equal(testCategoryId);

            testProduct = createdProduct; // Store for use in later tests
        });
    });

    describe('getProducts', () => {
        it('should return a paginated list of products', async () => {
            const limit = 1;
            const offset = 0;
            const paginationResult = await productService.getProducts(limit, offset);

            expect(paginationResult).to.have.property('totalEntries').that.is.a('number');
            expect(paginationResult.entries).to.be.an('array');
            expect(paginationResult.entries.length).to.be.at.most(limit);

            if (paginationResult.entries.length > 0) {
                expect(paginationResult.entries[0]).to.have.property('category');
            }
        });
    });

    describe('getProductById', () => {
        it('should return the product with the given ID', async () => {
            const fetchedProduct = await productService.getProductById(testProduct.id);

            expect(fetchedProduct).to.not.be.null;
            expect(fetchedProduct!.id).to.equal(testProduct.id);
            expect(fetchedProduct!.name).to.equal('Test Product');

            const fetchedCategory = await categoryService.getCategoryById(fetchedProduct!.categoryId);
            expect(fetchedCategory).to.not.be.null;
            expect(fetchedCategory!.name).to.equal('Test Category');
        });

        it('should return null for a non-existent product ID', async () => {
            const fetchedProduct = await productService.getProductById(9999);
            expect(fetchedProduct).to.be.null;
        });
    });

    describe('updateProduct', () => {
        it('should update the product with the given ID', async () => {
            const updatedData = { name: 'Updated Product Name', price: 150 };
            const updatedProduct = await productService.updateProduct(testProduct.id, updatedData);

            expect(updatedProduct.name).to.equal('Updated Product Name');
            expect(updatedProduct.price).to.equal(150);
            expect(updatedProduct.id).to.equal(testProduct.id);
        });
    });

    describe('deleteProduct', () => {
        it('should delete the product with the given ID', async () => {
            await productService.deleteProduct(testProduct.id);
            const deletedProduct = await productService.getProductById(testProduct.id);
            expect(deletedProduct).to.be.null;
        });
    });
});
