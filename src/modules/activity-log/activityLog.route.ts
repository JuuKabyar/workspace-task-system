// Define activity log routes

import express from "express";

import { getActivityLogs } from "./activityLog.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

const router = express.Router();

router.get("/:workspaceId", authMiddleware, roleMiddleware(["owner", "admin"]), getActivityLogs);

export default router;