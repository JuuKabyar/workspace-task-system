// Define member routes

import express from "express";
import { getMembers, updateMemberRole, removeMember } from "./member.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = express.Router();

router.get("/:workspaceId", authMiddleware, getMembers);
router.patch("/:workspaceId/:memberId/role", authMiddleware, updateMemberRole);
router.delete("/:workspaceId/:memberId", authMiddleware, removeMember);

export default router;