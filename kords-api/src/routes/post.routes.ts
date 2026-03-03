import { Router } from "express";
import * as controller from '../controllers/users.controller';
import { authenticate } from "../middleware/auth";
import { createPost, getPostById, getTimeline, updatePostById } from "../controllers/post.controller";
const router = Router();

router.post("/", authenticate, createPost);
router.put("/:id", authenticate, updatePostById);
router.get("/", getTimeline) // changer pour faire algorithme
router.get("/:id", getPostById)

export default router;