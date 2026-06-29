import { prisma } from "../../lib/prisma";
import { Role } from "../../../generated/prisma/client";


// Get Members
export const getMembersService = async (userId: number, workspaceId: number) => {

  const workspaceUser = await prisma.workspaceUser.findFirst({
    where: {
      userId: userId,
      workspaceId: workspaceId
    }
  }); // Check access

  if (!workspaceUser) {
    throw new Error("You do not have access to this workspace.");
  }

  const members = await prisma.workspaceUser.findMany({
    where: {
      workspaceId: workspaceId
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
export const updateMemberRoleService = async (
  userId: number,
  workspaceId: number,
  memberId: number,
  role: Role
) => {

  const owner = await prisma.workspaceUser.findFirst({
    where: {
      userId: userId,
      workspaceId: workspaceId,
      role: Role.owner
    }
  }); // Check owner

  if (!owner) {
    throw new Error("Only owner can update member role.");
  }

  const member = await prisma.workspaceUser.findUnique({
    where: {
      id: memberId
    }
  }); // Find member

  if (!member || member.workspaceId !== workspaceId) {
    throw new Error("Member not found.");
  }

  if (member.role === Role.owner) {
    throw new Error("Owner role cannot be changed.");
  }

  const updatedMember = await prisma.workspaceUser.update({
    where: {
      id: memberId
    },
    data: {
      role: role
    }
  }); // Update role

  return updatedMember;

};


// Remove Member
export const removeMemberService = async (
  userId: number,
  workspaceId: number,
  memberId: number
) => {

  const currentUser = await prisma.workspaceUser.findFirst({
    where: {
      userId: userId,
      workspaceId: workspaceId
    }
  }); // Find current user

  if (!currentUser) {
    throw new Error("You do not have access to this workspace.");
  }

  const member = await prisma.workspaceUser.findUnique({
    where: {
      id: memberId
    }
  }); // Find member

  if (!member || member.workspaceId !== workspaceId) {
    throw new Error("Member not found.");
  }

  if (member.role === Role.owner) {
    throw new Error("Owner cannot be removed.");
  }

  if (
    currentUser.role === Role.admin &&
    member.role !== Role.member
  ) {
    throw new Error("Admin can remove member only.");
  }

  if (
    currentUser.role === Role.member
  ) {
    throw new Error("Member cannot remove users.");
  }

  await prisma.workspaceUser.delete({
    where: {
      id: memberId
    }
  }); // Remove member

  return {
    message: "Member removed successfully."
  };

};