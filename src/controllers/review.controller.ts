import { Request, Response } from 'express';
import { ReviewService } from '../services/review.service'; // Adjust the path as necessary
import Joi from 'joi';
import { Prisma, Review } from '@prisma/client';
import PrismaClientKnownRequestError = Prisma.PrismaClientKnownRequestError;

const reviewService = new ReviewService();

function validate(data: Partial<Review>): Joi.ValidationResult {
    const schema = Joi.object({
        productId: Joi.number().integer().positive().required(),
        userId: Joi.number().integer().positive().required(),
        rating: Joi.number().integer().min(1).max(5).required(),
        comment: Joi.string().optional(),
        createdAt: Joi.date().optional(),
        updatedAt: Joi.date().optional()
    });

    return schema.validate(data);
}

export class ReviewController {
    async createReview(req: Request, res: Response) {
        const { productId, userId, rating, comment } = req.body;
        try {
            const { error, value } = validate(req.body);

            if (error) {
                return res.status(400).json({ error: error.message });
            }

            const newEntry = await reviewService.createReview(value);

            res.status(201).json(newEntry);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2003') {
                return res.status(404).json({ error: `Entry with ID '${productId}' not found` });
            }
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2004') {
                return res.status(404).json({ error: `Entry with ID '${userId}' not found` });
            }

            console.error(error);
            res.status(400).json({ error: 'Failed to create review' });
        }
    }

    async getReviews(req: Request, res: Response) {
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = parseInt(req.query.offset as string) || 0;
        try {
            const reviews = await reviewService.getReviews(limit, offset);
            res.status(200).json(reviews);
        } catch (error) {
            res.status(400).json({ error: 'Failed to fetch reviews' });
        }
    }

    async getReviewById(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        try {
            const review = await reviewService.getReviewById(id);
            if (review) {
                res.status(200).json(review);
            } else {
                res.status(404).json({ error: 'Review not found' });
            }
        } catch (error) {
            res.status(400).json({ error: 'Failed to fetch review' });
        }
    }
}
