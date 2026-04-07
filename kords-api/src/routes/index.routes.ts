import { Router } from 'express';
import authRoutes from './auth.routes';
import usersRoutes from './users.routes';
// import tabsRoutes from './tabs.routes';
import postRoutes from './post.routes';
const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use("/post", postRoutes)

export default router;