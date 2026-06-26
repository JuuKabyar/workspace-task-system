import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";

export const roleMiddleware = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        throw new Error("Unauthorized.");
      }

      const workspaceUser = await prisma.workspaceUser.findFirst({
        where: {
          userId: userId
        }
      }); // Find user's workspace role

      if (!workspaceUser) {
        throw new Error("You must create or join a workspace first.");
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