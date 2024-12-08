import express, { Request, Response, Router } from 'express';
import { ReviewController } from '../controllers/review.controller'; // Adjust the path as necessary

const router: Router = express.Router();
const reviewController = new ReviewController();

router.post('/', async (req: Request, res: Response) => {
    await reviewController.createReview(req, res);
});

router.get('/', async (req: Request, res: Response) => {
    await reviewController.getReviews(req, res);
});

router.get('/:id', async (req: Request, res: Response) => {
    await reviewController.getReviewById(req, res);
});

router.get('/product/:productId', async (req: Request, res: Response) => {
    await reviewController.getReviewsByProductId(req, res);
});

export default router;
