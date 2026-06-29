import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.route";
import workspaceRoutes from "./modules/workspace/workspace.route";
import invitationRoutes from "./modules/invitation/invitation.route";
import memberRoutes from "./modules/members/member.route";
import projectRoutes from "./modules/projects/project.route";
import taskRoutes from "./modules/tasks/task.route";

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

app.use(errorMiddleware);

export default app;