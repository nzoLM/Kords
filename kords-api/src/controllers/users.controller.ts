import { Request, Response } from 'express';
import { prisma } from '../index';
import bcrypt from 'bcrypt';

export const getCurrentConnectedUser = async (req: Request, res: Response) => {
    try {
        const id = req.user!.userId;

        const user = await prisma.user.findUnique({
            where: { id },
            omit: { password: true }
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.json(user);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, email: true, username: true, createdAt: true }
        });
        return res.json(users);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error', message: error });
    }
}
export const getUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (typeof id !== 'string') {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        const user = await prisma.user.findUnique({
            where: { id },
            omit: {
                password: true
            }
        })
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.json(user);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        if (typeof id != "string") {
            return res.status(400).json({ error: 'Invalid user ID' })
        }
        const { email, username } = req.body;

        const user = await prisma.user.update({
            where: { id },
            data: { email, username },
            omit: { password: true }
        })
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.json(user);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const updatePassword = async (req: Request, res: Response) => {
    try {
        //const { id } = req.user.id;
        const { id } = req.params;

        if (typeof id != "string") {
            return res.status(400).json({ error: 'Invalid user ID' })
        }

        const { currentPassword, newPassword } = req.body;
        
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) return res.status(404).json({ error: 'User not found' });
        
        const isValid = await bcrypt.compare(currentPassword, user.password);
        if (!isValid) return res.status(401).json({ error: 'Invalid password' });
        
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id },
            data: { password: hashedPassword }
        });
        
        return res.json({ message: 'Password updated successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        if (typeof id != "string") {
            return res.status(400).json({ error: 'Invalid user ID' })
        }

        await prisma.user.delete({
            where: { id }
        });
        
        return res.json({ message: 'User deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const getUserTabs = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        if (typeof id != "string") {
            return res.status(400).json({ error: 'Invalid user ID' })
        }

        const tabs = await prisma.tab.findMany({
            where: { authorId: id }
        });
        
        return res.json(tabs);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const getUserFollowers = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (typeof id != "string") {
            return res.status(400).json({ error: 'Invalid user ID' })
        }

        const followers = await prisma.follow.findMany({
            where: { followingId: id },
            include: { follower: { omit: { password: true } } }
        });
        
        return res.json(followers);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const getUserFollowing = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        if (typeof id != "string") {
            return res.status(400).json({ error: 'Invalid user ID' })
        }

        const following = await prisma.follow.findMany({
            where: { followerId: id },
            include: { following: { omit: { password: true } } }
        });
        
        return res.json(following);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const forgotPassword = async (req: Request, res : Response) => {

}