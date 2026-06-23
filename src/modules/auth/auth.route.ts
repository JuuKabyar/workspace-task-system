// to define auth urls

import express from "express";
import { register, login, logout, refreshToken, getMyProfile } from "./auth.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = express.Router();

router.post("/register", register);
// requires access token to login
router.post("/login", authMiddleware, login);
router.post("/logout", authMiddleware, logout);
router.post("/refresh", refreshToken);
router.get("/me", authMiddleware, getMyProfile);

export default router;