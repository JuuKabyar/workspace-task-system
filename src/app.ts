import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.route";
import workspaceRoutes from "./modules/workspace/workspace.route";
import invitationRoutes from "./modules/invitation/invitation.route";
import { errorMiddleware } from "./middlewares/error.middleware";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/workspace", workspaceRoutes);
app.use("/api/invitations", invitationRoutes);

app.use(errorMiddleware);

export default app;