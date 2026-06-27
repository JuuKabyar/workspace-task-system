// Define workspace routes

import express from "express";
import { createWorkspace, getMyWorkspaces, getWorkspace, updateWorkspace, deleteWorkspace } from "./workspace.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

const router = express.Router();

router.post("/", authMiddleware, createWorkspace);
router.get("/", authMiddleware, getMyWorkspaces);
router.get("/:workspaceId", authMiddleware, getWorkspace);
router.patch("/:workspaceId", authMiddleware, roleMiddleware(["owner"]), updateWorkspace);
router.delete("/:workspaceId", authMiddleware, roleMiddleware(["owner"]), deleteWorkspace);

export default router;