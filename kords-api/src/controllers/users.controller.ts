import { Request, Response } from 'express';
import { prisma } from '../index';
import bcrypt from 'bcrypt';

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, email: true, username: true, createdAt: true }
        });
        return res.json(users);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}
export const getUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.body
        const user = await prisma.user.findUnique({
            where: { id },
            omit : {
                password : true
            }
        })
        return res.json(user);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}

