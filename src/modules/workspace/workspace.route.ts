// Define workspace routes

import express from "express";
import { createWorkspace, getWorkspace, updateWorkspace, deleteWorkspace } from "./workspace.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

const router = express.Router();

router.post("/", authMiddleware, createWorkspace);
router.get("/", authMiddleware, getWorkspace);
router.patch("/", authMiddleware, roleMiddleware(["owner"]), updateWorkspace);
router.delete("/", authMiddleware, roleMiddleware(["owner"]), deleteWorkspace);

export default router;