import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";

export const roleMiddleware = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      const workspaceId = Number(req.params.workspaceId);

      if (!userId) {
        throw new Error("Unauthorized.");
      }

      if (!workspaceId) {
        throw new Error("Workspace id is required.");
      }

      const workspaceUser = await prisma.workspaceUser.findFirst({
        where: {
          userId: userId,
          workspaceId: workspaceId
        }
      }); // Check user role in workspace

      if (!workspaceUser) {
        throw new Error("You do not have access to this workspace.");
      }

      if (!allowedRoles.includes(workspaceUser.role)) {
        throw new Error("You do not have permission to perform this action.");
      }

      next();

    } catch (error) {
      next(error);
    }
  };
};