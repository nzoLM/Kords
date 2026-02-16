import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        req.user = decoded;
        
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};