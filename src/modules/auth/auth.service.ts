import { prisma } from "../../lib/prisma";
import { Role } from "../../../generated/prisma/client";
import { hashPassword, comparePassword } from "../../utils/bcrypt";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt";

// register
export const registerService = async (
  workspaceName: string,
  name: string,
  email: string,
  password: string
) => {
  // Check existing email
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await hashPassword(password);

  const workspace = await prisma.workspace.create({
    data: {
      name: workspaceName,
    },
  });

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: Role.owner,
      workspaceId: workspace.id,
    },
  });

  await prisma.workspace.update({
    where: {
      id: workspace.id,
    },
    data: {
      ownerId: user.id,
    },
  });

  const payload = {
    userId: user.id,
    workspaceId: user.workspaceId,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      workspaceId: user.workspaceId,
    },
    workspace: {
      id: workspace.id,
      name: workspace.name,
    },
  };
};

// login
export const loginService = async (
  email: string,
  password: string
) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordCorrect = await comparePassword(
    password,
    user.password
  );

  if (!isPasswordCorrect) {
    throw new Error("Invalid email or password");
  }

  const payload = {
    userId: user.id,
    workspaceId: user.workspaceId,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      workspaceId: user.workspaceId,
    },
  };
};