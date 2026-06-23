import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.route";
import workspaceRouter from "./modules/workspace/workspace.route";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/workspace", workspaceRouter);

export default app;