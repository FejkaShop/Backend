import express, { Request, Response, Router } from 'express';
import { OrderController } from '../controllers/order.controller';

const router: Router = express.Router();
const orderController = new OrderController();

router.post('/', async (req: Request, res: Response) => {
    await orderController.createOrder(req, res);
});

router.get('/', async (req: Request, res: Response) => {
    await orderController.getOrders(req, res);
});

router.get('/:id', async (req: Request, res: Response) => {
    await orderController.getOrderById(req, res);
});

router.put('/:id', async (req: Request, res: Response) => {
    await orderController.updateOrder(req, res);
});

router.delete('/:id', async (req: Request, res: Response) => {
    await orderController.deleteOrder(req, res);
});

export default router;
