import { prisma } from "../../lib/prisma";
import { Role } from "../../../generated/prisma/client";

// Create Workspace
export const createWorkspaceService = async (userId: number, name: string) => {
  if (!name) {
    throw new Error("Workspace name is required.");
  }

  const workspace = await prisma.workspace.create({
    data: {
      name: name,
      ownerId: userId
    }
  }); // Create workspace

  const workspaceUser = await prisma.workspaceUser.create({
    data: {
      userId: userId,
      workspaceId: workspace.id,
      role: Role.owner
    }
  }); // Create owner

  return {
    workspace,
    workspaceUser
  };
};

// Get My Workspaces
export const getMyWorkspacesService = async (userId: number) => {
  const workspaces = await prisma.workspaceUser.findMany({
    where: {
      userId: userId
    },
    include: {
      workspace: true
    }
  }); // Get joined workspaces

  return workspaces;
};

// Get Workspace By Id
export const getWorkspaceService = async (userId: number, workspaceId: number) => {
  const workspaceUser = await prisma.workspaceUser.findFirst({
    where: {
      userId: userId,
      workspaceId: workspaceId
    }
  }); // Check workspace access

  if (!workspaceUser) {
    throw new Error("You do not have access to this workspace.");
  }

  const workspace = await prisma.workspace.findUnique({
    where: {
      id: workspaceId
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
      },
      projects: true
    }
  }); // Get workspace

  if (!workspace) {
    throw new Error("Workspace not found.");
  }

  return workspace;
};

// Update Workspace
export const updateWorkspaceService = async (userId: number, workspaceId: number, name: string) => {
  if (!name) {
    throw new Error("Workspace name is required.");
  }

  const workspaceUser = await prisma.workspaceUser.findFirst({
    where: {
      userId: userId,
      workspaceId: workspaceId,
      role: Role.owner
    }
  }); // Check owner role

  if (!workspaceUser) {
    throw new Error("Only workspace owner can update workspace.");
  }

  const workspace = await prisma.workspace.update({
    where: {
      id: workspaceId
    },
    data: {
      name: name
    }
  }); // Update workspace

  return workspace;
};

// Delete Workspace
export const deleteWorkspaceService = async (userId: number, workspaceId: number) => {
  const workspaceUser = await prisma.workspaceUser.findFirst({
    where: {
      userId: userId,
      workspaceId: workspaceId,
      role: Role.owner
    }
  }); // Check owner role

  if (!workspaceUser) {
    throw new Error("Only workspace owner can delete workspace.");
  }

  const workspace = await prisma.workspace.delete({
    where: {
      id: workspaceId
    }
  }); // Delete workspace

  return workspace;
};