import { prisma } from "..";
import { Request, Response } from 'express';

export const getTimeline = async (req: Request, res: Response) => {
    try {

        const posts = await prisma.post.findMany();
        
        return res.json(posts);
    } catch (error) { 
        return res.status(500).json({ error: 'Internal server error' });
    }
}