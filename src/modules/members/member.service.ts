import { prisma } from "../../lib/prisma";
import { Role } from "../../../generated/prisma/client";

// Get Workspace Members
export const getWorkspaceMembersService = async (userId: number) => {
  const currentUser = await prisma.workspaceUser.findFirst({
    where: {
      userId: userId
    }
  }); // Find current workspace

  if (!currentUser) {
    throw new Error("You must create or join a workspace first.");
  }

  const members = await prisma.workspaceUser.findMany({
    where: {
      workspaceId: currentUser.workspaceId
    },
    include: {
      user: {
        omit: {
          password: true,
          refreshToken: true
        }
      }
    }
  }); // Get members

  return members;
};

// Update Member Role
export const updateMemberRoleService = async (userId: number, memberId: number, role: Role) => {
  if (role === Role.owner) {
    throw new Error("Owner role cannot be assigned.");
  }

  const currentUser = await prisma.workspaceUser.findFirst({
    where: {
      userId: userId,
      role: Role.owner
    }
  }); // Find owner workspace

  if (!currentUser) {
    throw new Error("Only owner can update member role.");
  }

  const targetMember = await prisma.workspaceUser.findFirst({
    where: {
      id: memberId,
      workspaceId: currentUser.workspaceId
    }
  }); // Find target member

  if (!targetMember) {
    throw new Error("Member not found.");
  }

  if (targetMember.userId === userId) {
    throw new Error("You cannot update your own role.");
  }

  if (targetMember.role === Role.owner) {
    throw new Error("Owner role cannot be changed.");
  }

  const updatedMember = await prisma.workspaceUser.update({
    where: {
      id: memberId
    },
    data: {
      role: role
    },
    include: {
      user: {
        omit: {
          password: true,
          refreshToken: true
        }
      }
    }
  }); // Update role

  return updatedMember;
};

// Remove Member
export const removeMemberService = async (userId: number, memberId: number) => {
  const currentUser = await prisma.workspaceUser.findFirst({
    where: {
      userId: userId
    }
  }); // Find current user workspace

  if (!currentUser) {
    throw new Error("You must create or join a workspace first.");
  }

  if (currentUser.role === Role.member) {
    throw new Error("Member cannot remove users.");
  }

  const targetMember = await prisma.workspaceUser.findFirst({
    where: {
      id: memberId,
      workspaceId: currentUser.workspaceId
    }
  }); // Find target member

  if (!targetMember) {
    throw new Error("Member not found.");
  }

  if (targetMember.role === Role.owner) {
    throw new Error("Owner cannot be removed.");
  }

  if (currentUser.role === Role.admin && targetMember.role !== Role.member) {
    throw new Error("Admin can remove member only.");
  }

  const deletedMember = await prisma.workspaceUser.delete({
    where: {
      id: memberId
    }
  }); // Remove member from workspace

  return deletedMember;
};