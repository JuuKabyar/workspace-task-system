import { Request, Response, NextFunction } from "express";

import { inviteUserService, getInvitationService, acceptInvitationService } from "./invitation.service";

import { successResponse } from "../../utils/response";


// Invite User
export const inviteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const workspaceId = Number(req.params.workspaceId);

    if (!workspaceId) {
      throw new Error("Workspace id is required.");
    }

    const result = await inviteUserService(
      req.user!.userId,
      workspaceId,
      req.body.email,
      req.body.role
    ); // Invite user

    return successResponse(res, 201, "Invitation sent successfully.", result);

  } catch (error) {
    next(error);
  }
};


// Get Invitation
export const getInvitation = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const workspaceId = Number(req.params.workspaceId);
    const invitationToken = req.query.invitationToken as string;

    if (!workspaceId) {
      throw new Error("Workspace id is required.");
    }

    if (!invitationToken) {
      throw new Error("Invitation token is required.");
    }

    const result = await getInvitationService(
      workspaceId,
      invitationToken
    ); // Get invitation

    return successResponse(res, 200, "Invitation fetched successfully.", result);

  } catch (error) {
    next(error);
  }
};


// Accept Invitation
export const acceptInvitation = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const workspaceId = Number(req.params.workspaceId);
    const invitationToken = req.body.invitationToken;

    if (!workspaceId) {
      throw new Error("Workspace id is required.");
    }

    if (!invitationToken) {
      throw new Error("Invitation token is required.");
    }

    const result = await acceptInvitationService(
      workspaceId,
      invitationToken,
      req.user!.userId
    ); // Accept invitation

    return successResponse(res, 200, "Invitation accepted successfully.", result);

  } catch (error) {
    next(error);
  }
};