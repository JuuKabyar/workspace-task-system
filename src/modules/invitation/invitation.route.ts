// Define invitation routes

import express from "express";

import {
  inviteUser,
  getInvitation,
  acceptInvitation
} from "./invitation.controller";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

const router = express.Router();


// Invite User
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["owner", "admin"]),
  inviteUser
);


// Get Invitation Details
router.get(
  "/",
  getInvitation
);


// Accept Invitation
router.post(
  "/accept",
  authMiddleware,
  acceptInvitation
);


export default router;