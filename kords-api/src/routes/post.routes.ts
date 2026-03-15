import { Router } from "express";
import * as controller from '../controllers/users.controller';
import { authenticate } from "../middleware/auth";
import { createPost, getPostById, getTimeline, updatePostById, likePost, commentPost } from "../controllers/post.controller";
const router = Router();

router.post("/", authenticate, createPost);
router.put("/:id", authenticate, updatePostById);
router.post("/:id/like", authenticate, likePost);
router.post("/:id/comment", authenticate, commentPost)
router.get("/", getTimeline)
router.get("/:id", getPostById)

export default router;