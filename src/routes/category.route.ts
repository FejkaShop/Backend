import express, { Router } from 'express';
import { Request, Response } from 'express';
import { CategoryController } from '../controllers/category.controller';

const router: Router = express.Router();
const categoryController = new CategoryController();

router.post('/', async (req: Request, res: Response) => {
    await categoryController.createCategory(req, res);
});

router.get('/', async (req: Request, res: Response) => {
    await categoryController.getCategories(req, res);
});

router.get('/:id', async (req: Request, res: Response) => {
    await categoryController.getCategoryById(req, res);
});

router.put('/:id', async (req: Request, res: Response) => {
    await categoryController.updateCategory(req, res);
});

router.delete('/:id', async (req: Request, res: Response) => {
    await categoryController.deleteCategory(req, res);
});

export default router;
