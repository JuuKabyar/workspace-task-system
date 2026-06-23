import express from "express";
import { getWorkspace } from "./workspace.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = express.Router();

router.get("/me", authMiddleware, getWorkspace);

export default router;