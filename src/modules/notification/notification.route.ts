// Define notification routes

import express from "express";
import { getNotifications, markNotificationAsRead } from "./notification.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = express.Router();

router.get("/:workspaceId", authMiddleware, getNotifications);
router.patch("/:workspaceId/:notificationId/read", authMiddleware, markNotificationAsRead);

export default router;