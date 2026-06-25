import { prisma } from "../../lib/prisma";

import {
  hashPassword,
  comparePassword
} from "../../utils/bcrypt";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} from "../../utils/jwt";


// Register
export const registerService = async (
  name: string,
  email: string,
  password: string
) => {

  const existingUser = await prisma.user.findUnique({
    where: {
      email: email
    }
  }); // Check existing user

  if (existingUser) {
    throw new Error("Email already exists.");
  }

  const hashedPassword =
    await hashPassword(password); // Hash password

  const user = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: hashedPassword
    },
    omit: {
      password: true,
      refreshToken: true
    }
  }); // Create user only

  return user;

};


// Login
export const loginService = async (
  email: string,
  password: string
) => {

  const user = await prisma.user.findUnique({
    where: {
      email: email
    }
  }); // Find user by email

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const isPasswordCorrect =
    await comparePassword(
      password,
      user.password
    ); // Compare password

  if (!isPasswordCorrect) {
    throw new Error("Invalid email or password.");
  }

  const workspaceUser =
    await prisma.workspaceUser.findFirst({
      where: {
        userId: user.id
      }
    }); // Find first workspace

  const payload = {
    userId: user.id,
    workspaceId: workspaceUser?.workspaceId,
    role: workspaceUser?.role
  }; // Create JWT payload

  const accessToken =
    generateAccessToken(payload);

  const refreshToken =
    generateRefreshToken(payload);

  const updatedUser =
    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        refreshToken: refreshToken
      },
      omit: {
        password: true,
        refreshToken: true
      }
    }); // Save refresh token

  return {
    accessToken,
    refreshToken,
    user: updatedUser,
    workspace: workspaceUser ?? null
  };

};

// Refresh Token
export const refreshTokenService = async (
  refreshToken: string
) => {

  const decoded = verifyRefreshToken(refreshToken) as {
    userId: number,
    workspaceId: number | null,
    role: string | null
  }; // Verify refresh token

  const user = await prisma.user.findUnique({
    where: {
      id: decoded.userId
    }
  }); // Find user

  if (!user) {
    throw new Error("User not found.");
  }

  if (user.refreshToken !== refreshToken) {
    throw new Error("Invalid refresh token.");
  }

  const payload = {
    userId: decoded.userId,
    workspaceId: decoded.workspaceId,
    role: decoded.role
  };

  const accessToken =
    generateAccessToken(payload); // Generate new access token

  return {
    accessToken
  };

};


// Get My Profile
export const getMyProfileService = async (
  userId: number
) => {

  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    omit: {
      password: true,
      refreshToken: true
    }
  }); // Find user

  if (!user) {
    throw new Error("User not found.");
  }

  return user;

};


// Update Profile
export const updateProfileService = async (
  userId: number,
  name: string
) => {

  if (!name) {
    throw new Error("Name is required.");
  }

  const user = await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      name: name
    },
    omit: {
      password: true,
      refreshToken: true
    }
  }); // Update profile

  return user;

};


// Update Avatar
export const updateAvatarService = async (
  userId: number,
  avatar: string
) => {

  const user = await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      avatar: avatar
    },
    omit: {
      password: true,
      refreshToken: true
    }
  }); // Update avatar

  return user;

};