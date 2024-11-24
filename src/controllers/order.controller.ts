import { Request, Response } from 'express';
import { Order, OrderStatus, Prisma } from '@prisma/client';
import Joi from 'joi';
import { OrderService } from '../services/order.service';
import PrismaClientKnownRequestError = Prisma.PrismaClientKnownRequestError;

const orderService: OrderService = new OrderService();

function validate(data: Partial<Order>): Joi.ValidationResult {
    const schema = Joi.object({
        userId: Joi.number().integer().positive().required(),
        totalAmount: Joi.number().positive().required(),
        status: Joi.string().valid(OrderStatus.CANCELED, OrderStatus.PENDING, OrderStatus.COMPLETED).required(),
        createdAt: Joi.date().optional(),
        updatedAt: Joi.date().optional()
    });

    return schema.validate(data);
}

export class OrderController {
    async createOrder(req: Request, res: Response) {
        try {
            const { error, value } = validate(req.body);

            if (error) {
                return res.status(400).json({ error: error.message });
            }

            const newEntry = await orderService.createOrder(value);
            res.status(201).json(newEntry);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to create category' });
        }
    }

    async getOrders(req: Request, res: Response) {
        try {
            const limit: number = parseInt(<string>req.query.limit) || 10;
            const offset: number = parseInt(<string>req.query.offset) || 0;

            const pagination = await orderService.getOrders(limit, offset);
            res.json(pagination);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch categories' });
        }
    }

    async getOrderById(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const entry = await orderService.getOrderById(parseInt(id));

            if (!entry) {
                return res.status(404).json({ error: `Entry with ID '${id}' not found` });
            }

            res.json(entry);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch category' });
        }
    }

    async updateOrder(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const { error, value } = validate(req.body);

            if (error) {
                return res.status(400).json({ error: error.message });
            }

            const updatedEntry = await orderService.updateOrder(parseInt(id), value);
            res.json(updatedEntry);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
                return res.status(404).json({ error: `Entry with ID '${id}' not found` });
            }

            res.status(500).json({ error });
        }
    }

    async deleteOrder(req: Request, res: Response) {
        const { id } = req.params;

        try {
            await orderService.deleteOrder(parseInt(id));

            res.status(204).send();
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
                return res.status(404).json({
                    error: `Entry with ID '${id}' not found`
                });
            }

            res.status(500).json({ error });
        }
    }
}
