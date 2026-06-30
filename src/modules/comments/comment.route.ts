// Define comment routes

import express from "express";
import { createComment, getTaskComments } from "./comment.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = express.Router();

router.post("/:workspaceId/:taskId", authMiddleware, createComment);
router.get("/:workspaceId/:taskId", authMiddleware, getTaskComments);

export default router;