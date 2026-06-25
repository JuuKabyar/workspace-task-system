import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";

export const roleMiddleware = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {

    const userId = req.user?.userId;
    const workspaceId = req.user?.workspaceId;

    // User not authenticated
    if (!userId || !workspaceId) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated.",
        errorCode: "NOT_AUTHENTICATED"
      });
    }

    const workspaceUser = await prisma.workspaceUser.findFirst({
      where: { userId, workspaceId }
    });

    // User not found in workspace
    if (!workspaceUser) {
      return res.status(404).json({
        success: false,
        message: "User does not belong to this workspace.",
        errorCode: "WORKSPACE_USER_NOT_FOUND"
      });
    }

    // Role permission denied
    if (!allowedRoles.includes(workspaceUser.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action.",
        errorCode: "ACCESS_DENIED"
      });
    }

    next();
  };
};