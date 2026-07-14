import { Router } from "express";
import * as controller from '../controllers/users.controller';
import { authenticate } from "../middleware/auth";
import { createPost, getPostById, getTimeline, updatePostById, likePost, commentPost, getPostByAuthorId, getPostByCurrentUser } from "../controllers/post.controller";
import multer from "multer";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", authenticate, upload.single("media"), createPost);
router.get("/me", authenticate, getPostByCurrentUser)
router.put("/:id", authenticate, updatePostById);
router.post("/:id/like", authenticate, likePost);
router.post("/:id/comment", authenticate, commentPost)
router.get("/", getTimeline)
router.get("/author/:id", getPostByAuthorId)
router.get("/:id", getPostById)

export default router;