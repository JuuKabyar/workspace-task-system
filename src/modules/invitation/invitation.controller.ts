import { Request, Response, NextFunction } from "express";

import {
  inviteUserService,
  getInvitationService,
  acceptInvitationService
} from "./invitation.service";

import { successResponse } from "../../utils/response";

// Invite User
export const inviteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const workspaceId =
      req.user?.workspaceId;

    if (!workspaceId) {
      throw new Error(
        "You must create or join a workspace first."
      );
    }

    const result =
      await inviteUserService(
        req.user!.userId,
        workspaceId,
        req.user!.role!,
        req.body.email,
        req.body.role
      );

    return successResponse(
      res,
      201,
      "Invitation sent successfully.",
      result
    );

  } catch (error) {
    next(error);
  }

};


// Get Invitation
export const getInvitation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const result =
      await getInvitationService(
        req.query.invitationToken as string
      ); // Get invitation

    return successResponse(
      res,
      200,
      "Invitation fetched successfully.",
      result
    );

  } catch (error) {
    next(error);
  }

};


// Accept Invitation
export const acceptInvitation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    if (!req.body.invitationToken) { // invitation token ကို body ကနေယူ
      throw new Error("Invitation token is required.");
    }

    const result =
      await acceptInvitationService(
        req.body.invitationToken,
        req.user!.userId
      ); // Accept invitation

    return successResponse(
      res,
      200,
      "Invitation accepted successfully.",
      result
    );

  } catch (error) {
    next(error);
  }

};