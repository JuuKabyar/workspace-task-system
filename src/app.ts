import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.route";
import workspaceRoutes from "./modules/workspace/workspace.route";
import invitationRoutes from "./modules/invitation/invitation.route";
import memberRoutes from "./modules/members/member.route";
import projectRoutes from "./modules/projects/project.route";
import taskRoutes from "./modules/tasks/task.route";
import dashboardRoutes from "./modules/dashboard/dashboard.route";
import commentRoutes from "./modules/comments/comment.route";
import activityLogRoutes from "./modules/activity-log/activityLog.route";
import notificationRoutes from "./modules/notification/notification.route"

import { errorMiddleware } from "./middlewares/error.middleware";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/invitations", invitationRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/activitylogs", activityLogRoutes);
app.use("/api/notifications", notificationRoutes);

app.use(errorMiddleware);

export default app;