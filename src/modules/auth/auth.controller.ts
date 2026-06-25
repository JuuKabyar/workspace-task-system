import { Request, Response, NextFunction } from "express";

import {
  registerService,
  loginService,
  refreshTokenService,
  getMyProfileService,
  updateProfileService,
  updateAvatarService
} from "./auth.service";

import { successResponse } from "../../utils/response";
import { prisma } from "../../lib/prisma";


// Register
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const result = await registerService(
      req.body.name,
      req.body.email,
      req.body.password
    ); // Create user only

    return successResponse(
      res,
      201,
      "Registration successful. Please log in.",
      result
    );

  } catch (error) {
    next(error);
  }

};


// Login
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const result = await loginService(
      req.body.email,
      req.body.password
    ); // Login and generate tokens

    return successResponse(
      res,
      200,
      "Login successful.",
      result
    );

  } catch (error) {
    next(error);
  }

};


// Refresh Token
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new Error("Refresh token is required.");
    }

    const token =
      authHeader.split(" ")[1];

    if (!token) {
      throw new Error("Invalid refresh token format.");
    }

    const result =
      await refreshTokenService(token); // Generate new access token

    return successResponse(
      res,
      200,
      "Access token refreshed successfully.",
      result
    );

  } catch (error) {
    next(error);
  }

};


// Logout
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const userId =
      req.user?.userId;

    if (!userId) {
      throw new Error("Unauthorized.");
    }

    await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        refreshToken: null
      }
    }); // Remove refresh token

    return successResponse(
      res,
      200,
      "Logout successful."
    );

  } catch (error) {
    next(error);
  }

};


// Get My Profile
export const getMyProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const userId =
      req.user?.userId;

    if (!userId) {
      throw new Error("Unauthorized.");
    }

    const result =
      await getMyProfileService(userId); // Find current user

    return successResponse(
      res,
      200,
      "Profile fetched successfully.",
      result
    );

  } catch (error) {
    next(error);
  }

};


// Update Profile
export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const userId =
      req.user?.userId;

    if (!userId) {
      throw new Error("Unauthorized.");
    }

    const result =
      await updateProfileService(
        userId,
        req.body.name
      ); // Update profile

    return successResponse(
      res,
      200,
      "Profile updated successfully.",
      result
    );

  } catch (error) {
    next(error);
  }

};


// Update Avatar
export const updateAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const userId =
      req.user?.userId;

    if (!userId) {
      throw new Error("Unauthorized.");
    }

    if (!req.file) {
      throw new Error("Avatar file is required.");
    }

    const avatar =
      `/uploads/avatars/${req.file.filename}`;

    const result =
      await updateAvatarService(
        userId,
        avatar
      ); // Update avatar

    return successResponse(
      res,
      200,
      "Avatar updated successfully.",
      result
    );

  } catch (error) {
    next(error);
  }

};