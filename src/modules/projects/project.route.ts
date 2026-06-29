// Define project routes

import express from "express";
import { createProject, getProjects, getProjectById, updateProject, deleteProject, assignMemberToProject, removeMemberFromProject } from "./project.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

const router = express.Router();

router.post("/:workspaceId", authMiddleware, roleMiddleware(["owner", "admin"]), createProject);
router.get("/:workspaceId", authMiddleware, getProjects);
router.get("/:workspaceId/:projectId", authMiddleware, getProjectById);
router.patch("/:workspaceId/:projectId", authMiddleware, roleMiddleware(["owner", "admin"]), updateProject);
router.delete("/:workspaceId/:projectId", authMiddleware, roleMiddleware(["owner"]), deleteProject);
router.post("/:workspaceId/:projectId/members", authMiddleware, roleMiddleware(["owner", "admin"]), assignMemberToProject);
router.delete("/:workspaceId/:projectId/members/:workspaceUserId", authMiddleware, roleMiddleware(["owner", "admin"]), removeMemberFromProject);

export default router;