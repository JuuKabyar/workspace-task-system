import { prisma } from "../../lib/prisma";
import { Role } from "../../../generated/prisma/client";

// Create Workspace
export const createWorkspaceService = async (userId: number, name: string) => {
  if (!name) {
    throw new Error("Workspace name is required.");
  }

  const existingWorkspace = await prisma.workspaceUser.findFirst({
    where: {
      userId: userId,
      role: Role.owner
    }
  }); // Check owner workspace

  if (existingWorkspace) {
    throw new Error("You already own a workspace.");
  }

  const workspace = await prisma.workspace.create({
    data: {
      name: name
    }
  }); // Create workspace

  const workspaceUser = await prisma.workspaceUser.create({
    data: {
      userId: userId,
      workspaceId: workspace.id,
      role: Role.owner
    }
  }); // Create owner

  const updatedWorkspace = await prisma.workspace.update({
    where: {
      id: workspace.id
    },
    data: {
      ownerId: userId
    }
  }); // Save owner id

  return {
    workspace: updatedWorkspace,
    workspaceUser
  };
};

// Get Workspace
export const getWorkspaceService = async (userId: number) => {
  const workspaceUser = await prisma.workspaceUser.findFirst({
    where: {
      userId: userId
    }
  }); // Find current workspace

  if (!workspaceUser) {
    throw new Error("You must create or join a workspace first.");
  }

  const workspace = await prisma.workspace.findUnique({
    where: {
      id: workspaceUser.workspaceId
    },
    include: {
      users: {
        include: {
          user: {
            omit: {
              password: true,
              refreshToken: true
            }
          }
        }
      }
    }
  }); // Find workspace

  if (!workspace) {
    throw new Error("Workspace not found.");
  }

  return workspace;
};

// Update Workspace
export const updateWorkspaceService = async (userId: number, name: string) => {
  if (!name) {
    throw new Error("Workspace name is required.");
  }

  const workspaceUser = await prisma.workspaceUser.findFirst({
    where: {
      userId: userId,
      role: Role.owner
    }
  }); // Find owner workspace

  if (!workspaceUser) {
    throw new Error("Only workspace owner can update workspace.");
  }

  const workspace = await prisma.workspace.update({
    where: {
      id: workspaceUser.workspaceId
    },
    data: {
      name: name
    }
  }); // Update workspace

  return workspace;
};

// Delete Workspace
export const deleteWorkspaceService = async (userId: number) => {
  const workspaceUser = await prisma.workspaceUser.findFirst({
    where: {
      userId: userId,
      role: Role.owner
    }
  }); // Find owner workspace

  if (!workspaceUser) {
    throw new Error("Only workspace owner can delete workspace.");
  }

  const workspace = await prisma.workspace.findUnique({
    where: {
      id: workspaceUser.workspaceId
    }
  }); // Check workspace exists

  if (!workspace) {
    throw new Error("Workspace not found.");
  }

  const deletedWorkspace = await prisma.workspace.delete({
    where: {
      id: workspaceUser.workspaceId
    }
  }); // Delete workspace

  return deletedWorkspace;
};