import { Router } from 'express';
import userRoutes from './users.routes';
import authRoutes from './auth.routes'

const router = Router();
router.use("/users", userRoutes)
router.use("/auth", authRoutes)

export default router;