import { prisma } from "../../lib/prisma";
import { Role, ProjectStatus } from "../../../generated/prisma/client";

// Create Project
export const createProjectService = async (
  userId: number,
  name: string,
  description?: string,
  startDate?: string,
  endDate?: string
) => {
  if (!name) {
    throw new Error("Project name is required.");
  }

  const workspaceUser = await prisma.workspaceUser.findFirst({
    where: {
      userId: userId
    }
  }); // Find current workspace user

  if (!workspaceUser) {
    throw new Error("You must create or join a workspace first.");
  }

  if (workspaceUser.role === Role.member) {
    throw new Error("Member cannot create project.");
  }

  const project = await prisma.project.create({
    data: {
      name: name,
      description: description,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      workspaceId: workspaceUser.workspaceId,
      createdById: userId
    }
  }); // Create project

  await prisma.projectMember.create({
    data: {
      projectId: project.id,
      workspaceUserId: workspaceUser.id
    }
  }); // Add creator to project

  return project;
};

// Get Projects
export const getProjectsService = async (userId: number) => {
  const workspaceUser = await prisma.workspaceUser.findFirst({
    where: {
      userId: userId
    }
  }); // Find current workspace user

  if (!workspaceUser) {
    throw new Error("You must create or join a workspace first.");
  }

  const whereCondition = workspaceUser.role === Role.member
    ? {
        workspaceId: workspaceUser.workspaceId,
        members: {
          some: {
            workspaceUserId: workspaceUser.id
          }
        }
      }
    : {
        workspaceId: workspaceUser.workspaceId
      };

  const projects = await prisma.project.findMany({
    where: whereCondition,
    include: {
      members: {
        include: {
          workspaceUser: {
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
      }
    }
  }); // Get projects

  return projects;
};

// Get Project By Id
export const getProjectByIdService = async (userId: number, projectId: number) => {
  const workspaceUser = await prisma.workspaceUser.findFirst({
    where: {
      userId: userId
    }
  }); // Find current workspace user

  if (!workspaceUser) {
    throw new Error("You must create or join a workspace first.");
  }

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      workspaceId: workspaceUser.workspaceId
    },
    include: {
      members: {
        include: {
          workspaceUser: {
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
      }
    }
  }); // Find project

  if (!project) {
    throw new Error("Project not found.");
  }

  if (workspaceUser.role === Role.member) {
    const isAssigned = project.members.some((member) => member.workspaceUserId === workspaceUser.id);

    if (!isAssigned) {
      throw new Error("You do not have permission to view this project.");
    }
  }

  return project;
};

// Update Project
export const updateProjectService = async (
  userId: number,
  projectId: number,
  name?: string,
  description?: string,
  status?: ProjectStatus,
  startDate?: string,
  endDate?: string
) => {
  const workspaceUser = await prisma.workspaceUser.findFirst({
    where: {
      userId: userId
    }
  }); // Find current workspace user

  if (!workspaceUser) {
    throw new Error("You must create or join a workspace first.");
  }

  if (workspaceUser.role === Role.member) {
    throw new Error("Member cannot update project.");
  }

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      workspaceId: workspaceUser.workspaceId
    }
  }); // Find project

  if (!project) {
    throw new Error("Project not found.");
  }

  const updatedProject = await prisma.project.update({
    where: {
      id: projectId
    },
    data: {
      name: name,
      description: description,
      status: status,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined
    }
  }); // Update project

  return updatedProject;
};

// Delete Project
export const deleteProjectService = async (userId: number, projectId: number) => {
  const workspaceUser = await prisma.workspaceUser.findFirst({
    where: {
      userId: userId,
      role: Role.owner
    }
  }); // Find owner

  if (!workspaceUser) {
    throw new Error("Only owner can delete project.");
  }

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      workspaceId: workspaceUser.workspaceId
    }
  }); // Find project

  if (!project) {
    throw new Error("Project not found.");
  }

  const deletedProject = await prisma.project.delete({
    where: {
      id: projectId
    }
  }); // Delete project

  return deletedProject;
};

// Assign Member To Project
export const assignMemberToProjectService = async (
  userId: number,
  projectId: number,
  workspaceUserId: number
) => {

  const currentUser =
    await prisma.workspaceUser.findFirst({
      where: {
        userId: userId
      }
    }); // Find current user

  if (!currentUser) {
    throw new Error("You must create or join a workspace first.");
  }

  if (currentUser.role === Role.member) {
    throw new Error("Member cannot assign project members.");
  }

  const project =
    await prisma.project.findFirst({
      where: {
        id: projectId,
        workspaceId: currentUser.workspaceId
      }
    }); // Find project

  if (!project) {
    throw new Error("Project not found.");
  }

  const targetMember =
    await prisma.workspaceUser.findFirst({
      where: {
        id: workspaceUserId,
        workspaceId: currentUser.workspaceId
      }
    }); // Find workspace member

  if (!targetMember) {
    throw new Error("Member not found in this workspace.");
  }

  const existingProjectMember =
    await prisma.projectMember.findFirst({
      where: {
        projectId: projectId,
        workspaceUserId: workspaceUserId
      }
    }); // Check already assigned

  if (existingProjectMember) {
    throw new Error("Member is already assigned to this project.");
  }

  const projectMember =
    await prisma.projectMember.create({
      data: {
        projectId: projectId,
        workspaceUserId: workspaceUserId
      }
    }); // Assign member

  return projectMember;

};

// Remove Member From Project
export const removeMemberFromProjectService = async (
  userId: number,
  projectId: number,
  workspaceUserId: number
) => {

  const currentUser =
    await prisma.workspaceUser.findFirst({
      where: {
        userId: userId
      }
    }); // Find current user

  if (!currentUser) {
    throw new Error("You must create or join a workspace first.");
  }

  if (currentUser.role === Role.member) {
    throw new Error("Member cannot remove project members.");
  }

  const project =
    await prisma.project.findFirst({
      where: {
        id: projectId,
        workspaceId: currentUser.workspaceId
      }
    }); // Find project

  if (!project) {
    throw new Error("Project not found.");
  }

  const targetMember =
    await prisma.workspaceUser.findFirst({
      where: {
        id: workspaceUserId,
        workspaceId: currentUser.workspaceId
      }
    }); // Find workspace member

  if (!targetMember) {
    throw new Error("Member not found in this workspace.");
  }

  const projectMember =
    await prisma.projectMember.findFirst({
      where: {
        projectId: projectId,
        workspaceUserId: workspaceUserId
      }
    }); // Find assigned member

  if (!projectMember) {
    throw new Error("Member is not assigned to this project.");
  }

  // Don't remove project creator
  if (project.createdById === targetMember.userId) {
    throw new Error("Project creator cannot be removed.");
  }

  await prisma.projectMember.delete({
    where: {
      id: projectMember.id
    }
  }); // Remove member

  return {
    message: "Member removed successfully."
  };

};