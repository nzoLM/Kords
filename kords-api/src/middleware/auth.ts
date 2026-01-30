
import jwt from 'jsonwebtoken';
import { prisma } from '../index'
import { env } from 'prisma/config';
export const authenticate = async (req: Request, res: Response, next: Function) => {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, env("JWT_SECRET"));

    const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true, role: true }
    });

    req.user = user;
    next();
};