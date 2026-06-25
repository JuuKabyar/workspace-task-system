// Define auth routes

import express from "express";

import {
  register,
  login,
  logout,
  refreshToken,
  getMyProfile,
  updateProfile,
  updateAvatar
} from "./auth.controller";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { upload } from "../../middlewares/upload.middleware";

const router = express.Router();


// Register User
router.post(
  "/register",
  register
);


// Login User
router.post(
  "/login",
  login
);


// Refresh Access Token
router.post(
  "/refresh",
  refreshToken
);


// Logout User
router.post(
  "/logout",
  authMiddleware,
  logout
);


// Get My Profile
router.get(
  "/me",
  authMiddleware,
  getMyProfile
);


// Update Profile
router.patch(
  "/profile",
  authMiddleware,
  updateProfile
);


// Update Avatar
router.patch(
  "/avatar",
  authMiddleware,
  upload.single("avatar"),
  updateAvatar
);


export default router;