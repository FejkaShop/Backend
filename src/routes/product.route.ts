import express, { Router } from 'express';
import { Request, Response } from 'express';
import { ProductController } from '../controllers/product.controller';

const router: Router = express.Router();
const productController = new ProductController();

router.post('/', async (req: Request, res: Response) => {
    await productController.createProduct(req, res);
});

router.get('/', async (req: Request, res: Response) => {
    await productController.getProducts(req, res);
});

router.get('/:id', async (req: Request, res: Response) => {
    await productController.getProductById(req, res);
});

router.put('/:id', async (req: Request, res: Response) => {
    await productController.updateProduct(req, res);
});

router.delete('/:id', async (req: Request, res: Response) => {
    await productController.deleteProduct(req, res);
});

export default router;
