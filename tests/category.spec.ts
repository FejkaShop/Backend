import { expect } from 'chai';
import { PrismaClient } from '@prisma/client';
import { CategoryService } from '../src/services/category.service';
import { Category } from '../src/model/Category';

const prisma = new PrismaClient();
const categoryService = new CategoryService();

describe('CategoryService', () => {
    let testCategory: Category;

    before(async () => {
        // Clean up the database or setup initial data for tests
        await prisma.category.deleteMany({});
    });

    after(async () => {
        // Clean up after all tests are done
        await prisma.category.deleteMany({});
        await prisma.$disconnect();
    });

    describe('createCategory', () => {
        it('should create a new category', async () => {
            const categoryData = { name: 'Test Category', description: 'Test Description' };
            const createdCategory = await categoryService.createCategoryFromObject(categoryData);

            expect(createdCategory).to.have.property('id');
            expect(createdCategory.name).to.equal('Test Category');
            expect(createdCategory.description).to.equal('Test Description');

            testCategory = createdCategory; // Store for later tests
        });
    });

    describe('getCategories', () => {
        it('should return a paginated list of categories', async () => {
            const limit = 1;
            const offset = 0;
            const paginationResult = await categoryService.getCategories(limit, offset);

            expect(paginationResult).to.have.property('totalEntries').that.is.a('number');
            expect(paginationResult.entries).to.be.an('array');
            expect(paginationResult.entries.length).to.be.at.most(limit);
        });
    });

    describe('getCategoryById', () => {
        it('should return the category with the given ID', async () => {
            const fetchedCategory = await categoryService.getCategoryById(testCategory.id);

            expect(fetchedCategory).to.not.be.null;
            expect(fetchedCategory!.id).to.equal(testCategory.id);
            expect(fetchedCategory!.name).to.equal('Test Category');
        });

        it('should return null for a non-existent category ID', async () => {
            const fetchedCategory = await categoryService.getCategoryById(9999);
            expect(fetchedCategory).to.be.null;
        });
    });

    describe('updateCategory', () => {
        it('should update the category with the given ID', async () => {
            const updatedData = { name: 'Updated Category Name' };
            const updatedCategory = await categoryService.updateCategory(testCategory.id, updatedData);

            expect(updatedCategory.name).to.equal('Updated Category Name');
            expect(updatedCategory.id).to.equal(testCategory.id);
        });
    });

    describe('deleteCategory', () => {
        it('should delete the category with the given ID', async () => {
            await categoryService.deleteCategory(testCategory.id);
            const deletedCategory = await categoryService.getCategoryById(testCategory.id);
            expect(deletedCategory).to.be.null;
        });
    });
});
