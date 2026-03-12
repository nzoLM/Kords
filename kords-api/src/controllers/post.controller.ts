import { prisma } from "..";
import { Request, Response } from 'express';

export const getTimeline = async (req: Request, res: Response) => {
    try {
        const posts = await prisma.post.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                    }
                }
            }
        });

        return res.json(posts);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const getPostById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (typeof id !== 'string') {
            return res.status(400).json({ error: 'Invalid post ID' });
        }

        const posts = await prisma.post.findUnique({
            where: { id },
        }
        );

        return res.json(posts);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const getPostByAuthorId = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (typeof id !== 'string') {
            return res.status(400).json({ error: 'Invalid post ID' });
        }

        const posts = await prisma.post.findUnique({
            where: { authorId: id },
        }
        );

        return res.json(posts);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const createPost = async (req: Request, res: Response) => {
    
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authentified.' });
        }
        const user = req.user;
        const { content, title, category, mediaUrl, mediaType } = req.body;
        if (!content || !title) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const post = await prisma.post.create({
            data: {
                content: content,
                title: title,
                category: category,
                published: true,
                author: {
                    connect: { id: user.userId }
                },
                ...(mediaUrl && { mediaUrl }),
                ...(mediaType && { mediaType }),
            }
        })
        return res.status(201).json(post);
    } catch (error) {
        return res.status(500).json(error)
    }
}

export const deletePostById = async (req: Request, res: Response) => {

    const { id } = req.params;

    if (typeof id != "string") {
        return res.status(400).json({ error: 'Invalid user ID' })
    }
    try {

        const post = await prisma.post.delete({
            where: { id }
        })
        return res.status(200).json(post);
    } catch (error) {
        return res.status(500).json({ error: error })
    }
}

export const updatePostById = async (req: Request, res: Response) => {

    try {
        const { id } = req.params;

        if (typeof id != "string") {
            return res.status(400).json({ error: 'Invalid post ID' })
        }
        const { content, title, category, mediaUrl, mediaType } = req.body;
        if (!content || !title) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const post = await prisma.post.update({
            where: { id },
            data: {
                content: content,
                title: title,
                category: category,
                published: false,
                ...(mediaUrl && { mediaUrl }),
                ...(mediaType && { mediaType }),
            }
        })
        return res.status(201).json(post);
    } catch (error) {
        return res.status(500).json({ error: error })
    }
} 

export const likePost = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authentified.' });
        }

        const { id } = req.params;

        if (typeof id !== 'string') {
            return res.status(400).json({ error: 'Invalid post ID' });
        }

        const existing = await prisma.reaction.findFirst({
            where: { postId: id, userId: req.user.userId, type: 'LIKE' }
        });

        if (existing) {
            await prisma.reaction.delete({ where: { id: existing.id } });
            return res.status(200).json({ liked: false });
        }

        await prisma.reaction.create({
            data: { postId: id, userId: req.user.userId, type: 'LIKE' }
        });

        return res.status(201).json({ liked: true });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}