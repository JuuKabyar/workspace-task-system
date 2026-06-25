import { prisma } from "../../lib/prisma";
import { Role } from "../../../generated/prisma/client";


// Create Workspace
export const createWorkspaceService = async (
  userId: number,
  name: string
) => {

  const existingWorkspace =
    await prisma.workspaceUser.findFirst({
      where: {
        userId: userId,
        role: Role.owner
      }
    }); // Check owner workspace

  if (existingWorkspace) {
    throw new Error("You already own a workspace.");
  }

  const workspace =
    await prisma.workspace.create({
      data: {
        name: name
      }
    }); // Create workspace

  const workspaceUser =
    await prisma.workspaceUser.create({
      data: {
        userId: userId,
        workspaceId: workspace.id,
        role: Role.owner
      }
    }); // Create owner

  const updatedWorkspace =
    await prisma.workspace.update({
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
export const getWorkspaceService = async (
  workspaceId: number
) => {

  const workspace =
    await prisma.workspace.findUnique({
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
        }
      }
    }); // Find workspace

  if (!workspace) {
    throw new Error("Workspace not found.");
  }

  return workspace;

};


// Update Workspace
export const updateWorkspaceService = async (
  workspaceId: number,
  name: string
) => {

  const workspace =
    await prisma.workspace.update({
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
export const deleteWorkspaceService = async (
  workspaceId: number
) => {

  const workspace =
    await prisma.workspace.delete({
      where: {
        id: workspaceId
      }
    }); // Delete workspace

  return workspace;

};