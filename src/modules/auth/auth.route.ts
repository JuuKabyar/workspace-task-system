// Define auth routes

import express from "express";
import { register, login, logout, refreshToken, getMyProfile, updateProfile, updateAvatar } from "./auth.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { upload } from "../../middlewares/upload.middleware";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", authMiddleware, logout);
router.get("/me", authMiddleware, getMyProfile);
router.patch("/profile", authMiddleware, updateProfile);
router.patch("/avatar", authMiddleware, upload.single("avatar"), updateAvatar);

export default router;