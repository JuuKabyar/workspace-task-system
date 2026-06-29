// Define invitation routes

import express from "express";

import { inviteUser, getInvitation, acceptInvitation } from "./invitation.controller";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

const router = express.Router();

router.post("/:workspaceId", authMiddleware, roleMiddleware(["owner", "admin"]), inviteUser);
router.get("/:workspaceId", getInvitation);
router.post("/:workspaceId/accept", authMiddleware, acceptInvitation);

export default router;