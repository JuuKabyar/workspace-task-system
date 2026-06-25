// Define workspace routes

import express from "express";

import {
  createWorkspace,
  getWorkspace,
  updateWorkspace,
  deleteWorkspace
} from "./workspace.controller";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

const router = express.Router();


// Create Workspace
router.post(
  "/",
  authMiddleware,
  createWorkspace
);


// Get Current Workspace
router.get(
  "/",
  authMiddleware,
  getWorkspace
);


// Update Workspace (Owner Only)
router.patch(
  "/",
  authMiddleware,
  roleMiddleware(["owner"]),
  updateWorkspace
);


// Delete Workspace (Owner Only)
router.delete(
  "/",
  authMiddleware,
  roleMiddleware(["owner"]),
  deleteWorkspace
);


export default router;