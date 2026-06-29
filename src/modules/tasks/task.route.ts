// Define task routes

import express from "express";
import { createTask, getTasks, getTaskById, updateTask, updateMyTaskStatus, deleteTask } from "./task.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

const router = express.Router();

router.post("/:workspaceId/:projectId", authMiddleware, roleMiddleware(["owner", "admin"]), createTask);
router.get("/:workspaceId", authMiddleware, getTasks);
router.get("/:workspaceId/:taskId", authMiddleware, getTaskById);
router.patch("/:workspaceId/:taskId", authMiddleware, roleMiddleware(["owner", "admin"]), updateTask);
router.patch("/:workspaceId/:taskId/status", authMiddleware, updateMyTaskStatus);
router.delete("/:workspaceId/:taskId", authMiddleware, roleMiddleware(["owner", "admin"]), deleteTask);

export default router;