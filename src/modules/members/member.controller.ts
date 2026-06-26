import { Request, Response, NextFunction } from "express";
import { getWorkspaceMembersService, updateMemberRoleService, removeMemberService } from "./member.service";
import { successResponse } from "../../utils/response";

// Get Workspace Members
export const getWorkspaceMembers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getWorkspaceMembersService(req.user!.userId); // Get members

    return successResponse(res, 200, "Members fetched successfully.", result);

  } catch (error) {
    next(error);
  }
};

// Update Member Role
export const updateMemberRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const memberId = Number(req.params.memberId);

    const result = await updateMemberRoleService(
      req.user!.userId,
      memberId,
      req.body.role
    ); // Update role

    return successResponse(res, 200, "Member role updated successfully.", result);

  } catch (error) {
    next(error);
  }
};

// Remove Member
export const removeMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const memberId = Number(req.params.memberId);

    const result = await removeMemberService(
      req.user!.userId,
      memberId
    ); // Remove member

    return successResponse(res, 200, "Member removed successfully.", result);

  } catch (error) {
    next(error);
  }
};