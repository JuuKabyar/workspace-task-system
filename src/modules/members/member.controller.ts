import { Request, Response, NextFunction } from "express";

import { getMembersService, updateMemberRoleService, removeMemberService } from "./member.service";

import { successResponse } from "../../utils/response";


// Get Members
export const getMembers = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const workspaceId = Number(req.params.workspaceId);

    if (!workspaceId) {
      throw new Error("Workspace id is required.");
    }

    const result = await getMembersService(req.user!.userId, workspaceId); // Get members

    return successResponse(res, 200, "Members fetched successfully.", result);

  } catch (error) {
    next(error);
  }
};


// Update Member Role
export const updateMemberRole = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const workspaceId = Number(req.params.workspaceId);
    const memberId = Number(req.params.memberId);

    if (!workspaceId) {
      throw new Error("Workspace id is required.");
    }

    if (!memberId) {
      throw new Error("Member id is required.");
    }

    const result = await updateMemberRoleService(
      req.user!.userId,
      workspaceId,
      memberId,
      req.body.role
    ); // Update member role

    return successResponse(res, 200, "Member role updated successfully.", result);

  } catch (error) {
    next(error);
  }
};


// Remove Member
export const removeMember = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const workspaceId = Number(req.params.workspaceId);
    const memberId = Number(req.params.memberId);

    if (!workspaceId) {
      throw new Error("Workspace id is required.");
    }

    if (!memberId) {
      throw new Error("Member id is required.");
    }

    const result = await removeMemberService(
      req.user!.userId,
      workspaceId,
      memberId
    ); // Remove member

    return successResponse(res, 200, "Member removed successfully.", result);

  } catch (error) {
    next(error);
  }
};