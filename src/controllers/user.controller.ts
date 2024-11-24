import { Request, Response } from 'express';
import { Prisma, User, UserRole } from '@prisma/client';
import { Pagination } from '../model/Pagination';
import { UserService } from '../services/user.service';
import Joi from 'joi';
import PrismaClientKnownRequestError = Prisma.PrismaClientKnownRequestError;

const userService: UserService = new UserService();

function validate(data: Partial<User>): Joi.ValidationResult {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        name: Joi.string().min(1).optional(),
        role: Joi.string().valid(UserRole.CUSTOMER, UserRole.ADMIN).required()
    });

    return schema.validate(data);
}

export class UserController {
    async createUser(req: Request, res: Response) {
        try {
            const { error, value } = validate(req.body);

            if (error) {
                return res.status(400).json({ error: error.message });
            }

            const newEntry: User = await userService.createUser(value);
            res.status(201).json(newEntry);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to create category' });
        }
    }

    async getUsers(req: Request, res: Response) {
        try {
            const limit: number = parseInt(<string>req.query.limit) || 10;
            const offset: number = parseInt(<string>req.query.offset) || 0;

            const pagination: Pagination<User> = await userService.getUsers(limit, offset);
            res.json(pagination);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch categories' });
        }
    }

    async getUserById(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const entry = await userService.getUserById(parseInt(id));

            if (!entry) {
                return res.status(404).json({ error: `Entry with ID '${id}' not found` });
            }

            res.json(entry);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch category' });
        }
    }

    async updateUser(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const { error, value } = validate(req.body);

            if (error) {
                return res.status(400).json({ error: error.message });
            }

            const updatedEntry: User = await userService.updateUser(parseInt(id), value);
            res.json(updatedEntry);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
                return res.status(404).json({ error: `Entry with ID '${id}' not found` });
            }

            res.status(500).json({ error });
        }
    }

    async deleteUser(req: Request, res: Response) {
        const { id } = req.params;

        try {
            await userService.deleteUser(parseInt(id));

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
