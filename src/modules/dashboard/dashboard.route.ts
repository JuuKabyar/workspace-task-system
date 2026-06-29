// Define dashboard routes

import express from "express";
import { getAdminDashboard, getMemberDashboard } from "./dashboard.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

const router = express.Router();

router.get("/admin/:workspaceId", authMiddleware, roleMiddleware(["owner", "admin"]), getAdminDashboard);
router.get("/member/:workspaceId", authMiddleware, roleMiddleware(["member"]), getMemberDashboard);

export default router;