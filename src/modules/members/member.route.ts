// Define member routes

import express from "express";
import { getWorkspaceMembers, updateMemberRole, removeMember } from "./member.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

const router = express.Router();

// Get Workspace Members
router.get("/", authMiddleware, roleMiddleware(["owner", "admin"]), getWorkspaceMembers);

// Update Member Role
router.patch("/:memberId/role", authMiddleware, roleMiddleware(["owner"]), updateMemberRole);

// Remove Member
router.delete("/:memberId", authMiddleware, roleMiddleware(["owner", "admin"]), removeMember);

export default router;