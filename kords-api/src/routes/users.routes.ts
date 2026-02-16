import { Router } from "express";
import * as controller from '../controllers/users.controller';
import { authenticate } from "../middleware/auth";
const router = Router();

router.get('/', controller.getUsers)
router.get("/:id", controller.getUserById);
router.get("/:id/followers", controller.getUserFollowers)
router.get("/:id/following", controller.getUserFollowing)
router.get("/:id/tabs", controller.getUserTabs)
router.put("/:id",authenticate, controller.updateUser)
router.put("/:id/password", authenticate, controller.updatePassword)
router.delete("/:id/delete", authenticate, controller.deleteUser)

export default router;