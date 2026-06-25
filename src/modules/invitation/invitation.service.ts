import { prisma } from "../../lib/prisma";
import { Role } from "../../../generated/prisma/enums";

import { sendMail } from "../../utils/mail";

import {
  generateInvitationToken,
  verifyInvitationToken
} from "../../utils/jwt";


// Invite User
export const inviteUserService = async (
  invitedById: number,
  workspaceId: number,
  inviterRole: string,
  email: string,
  role: Role
) => {

  if (inviterRole === "owner" && role === "owner") {
    throw new Error("Owner can only invite admin or member.");
  }

  if (inviterRole === "admin" && role !== "member") {
    throw new Error("Admin can only invite member.");
  }

  const existingInvitation =
    await prisma.invitation.findFirst({
      where: {
        email: email,
        workspaceId: workspaceId,
        status: "pending"
      }
    }); // Check duplicate pending invitation

  if (existingInvitation) {
    throw new Error("User already invited.");
  }

  const existingWorkspaceUser =
    await prisma.workspaceUser.findFirst({
      where: {
        workspaceId: workspaceId,
        user: {
          email: email
        }
      }
    }); // Check already joined workspace

  if (existingWorkspaceUser) {
    throw new Error("User already joined this workspace.");
  }

  const invitation =
    await prisma.invitation.create({
      data: {
        email: email,
        role: role,
        token: "",
        workspaceId: workspaceId,
        invitedById: invitedById
      }
    }); // Create invitation first

  const token =
    generateInvitationToken({
      invitationId: invitation.id,
      email: invitation.email
    }); // Create invitation JWT token

  const updatedInvitation =
    await prisma.invitation.update({
      where: {
        id: invitation.id
      },
      data: {
        token: token
      }
    }); // Save token

//   const invitationLink = `${process.env.FRONTEND_URL}/accept-invitation?invitationToken=${token}`; // frondend

    const invitationLink = `http://localhost:3000/api/invitations?invitationToken=${token}`; // backend

  const html =
  `
    <h2>Workspace Invitation</h2>

    <p>You have been invited to join a workspace.</p>

    <p>Role: ${role}</p>

    <a href="${invitationLink}">
      Accept Invitation
    </a>
  `;

  await sendMail(
    email,
    "Workspace Invitation",
    html
  ); // Send invitation email

  return {
    id: updatedInvitation.id,
    email: updatedInvitation.email,
    role: updatedInvitation.role,
    workspaceId: updatedInvitation.workspaceId,
    invitedById: updatedInvitation.invitedById,
    status: updatedInvitation.status,
    invitationToken: token
  };

};


// Get Invitation
export const getInvitationService = async (
  token: string
) => {

  const decoded =
    verifyInvitationToken(token) as {
      invitationId: number,
      email: string
    }; // Verify invitation token

  const invitation =
    await prisma.invitation.findUnique({
      where: {
        id: decoded.invitationId
      },
      include: {
        workspace: true
      }
    }); // Find invitation

  if (!invitation) {
    throw new Error("Invitation not found.");
  }

  if (invitation.token !== token) {
    throw new Error("Invalid invitation token.");
  }

  const user =
    await prisma.user.findUnique({
      where: {
        email: invitation.email
      }
    }); // Check account exists

  return {
    id: invitation.id,
    email: invitation.email,
    role: invitation.role,
    status: invitation.status,
    workspaceId: invitation.workspaceId,
    workspace: {
      id: invitation.workspace.id,
      name: invitation.workspace.name
    },
    hasAccount: user ? true : false,
    nextAction: user ? "login" : "register",
    nextPage: user
      ? `/login?invitationToken=${token}`
      : `/register?invitationToken=${token}`,
    invitationToken: token
  };

};


// Accept Invitation
export const acceptInvitationService = async (
  invitationToken: string,
  userId: number
) => {

  const decoded =
    verifyInvitationToken(invitationToken) as {
      invitationId: number,
      email: string
    }; // Verify invitation token

  const invitation =
    await prisma.invitation.findUnique({
      where: {
        id: decoded.invitationId
      }
    }); // Find invitation

  if (!invitation) {
    throw new Error("Invitation not found.");
  }

  if (invitation.token !== invitationToken) {
    throw new Error("Invalid invitation token.");
  }

  if (invitation.status !== "pending") {
    throw new Error("Invitation already used.");
  }

  const user =
    await prisma.user.findUnique({
      where: {
        id: userId
      }
    }); // Find logged in user

  if (!user) {
    throw new Error("User not found.");
  }

  if (user.email !== invitation.email) {
    throw new Error("This invitation does not belong to you.");
  }

  const existingWorkspaceUser =
    await prisma.workspaceUser.findFirst({
      where: {
        userId: user.id,
        workspaceId: invitation.workspaceId
      }
    }); // Check already joined

  if (existingWorkspaceUser) {
    throw new Error("User already joined this workspace.");
  }

  const workspaceUser =
    await prisma.workspaceUser.create({
      data: {
        userId: user.id,
        workspaceId: invitation.workspaceId,
        role: invitation.role
      }
    }); // Join workspace

  await prisma.invitation.update({
    where: {
      id: invitation.id
    },
    data: {
      status: "accepted"
    }
  }); // Mark accepted

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    },
    workspaceUser: workspaceUser
  };

};