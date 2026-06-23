import { prisma } from "../../lib/prisma";
import { Role } from "../../../generated/prisma/client";
import { hashPassword, comparePassword } from "../../utils/bcrypt";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../utils/jwt";

// Register
export const registerService = async (
    workspaceName: string,
    name: string,
    email: string,
    password: string
) => {
  const existingUser = await prisma.user.findUnique({
      where: {
          email: email
      }
  }) // Find user by email

  if(existingUser){
      throw new Error(
          "Email Already Exists."
      )
  }

  const hashedPassword = await hashPassword(password); // Hash password

  const workspace = await prisma.workspace.create({
      data: {
          name: workspaceName
      }
  }) // Create workspace

  const user = await prisma.user.create({
    data: {
        name: name,
        email: email,
        password: hashedPassword,
        role: Role.owner,
        workspaceId: workspace.id
    }
  }) // Create owner user

  const updatedWorkspace = await prisma.workspace.update({
    where: {
        id: workspace.id
    },
    data: {
        ownerId: user.id
    }
  }) // Save owner id in workspace

  const payload = {
      userId: user.id,
      workspaceId: user.workspaceId,
      role: user.role
  } // Create JWT payload

  const accessToken = generateAccessToken(payload); // Generate access token
  const refreshToken = generateRefreshToken(payload); // Generate refresh token

  await prisma.user.update({
    where: {
      id: user.id
    },
    data: {
      refreshToken: refreshToken
    }
  }) // Save refresh token in database

  return {
      accessToken,
      refreshToken,
      user,
      workspace: updatedWorkspace
  }
}

// Login
export const loginService = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: {
        email: email
    }
  }) // Find user by email

  if(!user){
      throw new Error(
          "Invalid Email or Password."
      )
  }

  const isPasswordCorrect = await comparePassword(
      password,
      user.password
  ) // Compare password

  if(!isPasswordCorrect){
      throw new Error(
          "Invalid Email or Password."
      )
  }
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
    workspaceId: user.workspaceId,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

// Refresh Token
export const refreshTokenService = async (refreshToken: string) => {
  const decoded = verifyRefreshToken(refreshToken) as {
    userId: number,
    workspaceId: number,
    role: string
  } // Verify refresh token

  const user = await prisma.user.findUnique({
    where: {
      id: decoded.userId
    }
  }) // Find user by id

  if(!user){
    throw new Error("User Not Found.")
  }

  if(user.refreshToken !== refreshToken){
    throw new Error("Invalid Refresh Token.")
  }

  const payload = {
    userId: decoded.userId,
    workspaceId: decoded.workspaceId,
    role: decoded.role
  } // Create payload for new token

  const accessToken = generateAccessToken(payload); // Generate new access token

  return {
      accessToken
  }
}

// Get My Profile
export const getMyProfileService = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },

    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
      workspaceId: true
    }
  }) // Find user by id

  if(!user){
    throw new Error("User Not Found.")
  }
  return user
}