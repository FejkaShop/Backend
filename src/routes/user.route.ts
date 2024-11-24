import express, { Request, Response, Router } from 'express';
import { UserController } from '../controllers/user.controller';

const router: Router = express.Router();
const userController = new UserController();

router.post('/', async (req: Request, res: Response) => {
    await userController.createUser(req, res);
});

router.get('/', async (req: Request, res: Response) => {
    await userController.getUsers(req, res);
});

router.get('/:id', async (req: Request, res: Response) => {
    await userController.getUserById(req, res);
});

router.put('/:id', async (req: Request, res: Response) => {
    await userController.updateUser(req, res);
});

router.delete('/:id', async (req: Request, res: Response) => {
    await userController.deleteUser(req, res);
});

export default router;
