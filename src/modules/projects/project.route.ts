// Define project routes

import express from "express";
import { createProject, getProjects, getProjectById, updateProject, deleteProject, assignMemberToProject, removeMemberFromProject } from "./project.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

const router = express.Router();

router.post("/", authMiddleware, roleMiddleware(["owner", "admin"]), createProject);
router.get("/", authMiddleware, getProjects);
router.get("/:projectId", authMiddleware, getProjectById);
router.patch("/:projectId", authMiddleware, roleMiddleware(["owner", "admin"]), updateProject);
router.delete("/:projectId", authMiddleware, roleMiddleware(["owner"]), deleteProject);
router.post("/:projectId/members", authMiddleware, roleMiddleware(["owner", "admin"]), assignMemberToProject);
router.delete("/:projectId/members/:workspaceUserId", authMiddleware, roleMiddleware(["owner", "admin"]), removeMemberFromProject);

export default router;