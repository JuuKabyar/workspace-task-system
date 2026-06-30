import { prisma } from "../../lib/prisma";
import { Role } from "../../../generated/prisma/client";


// Create Activity Log
export const createActivityLogService = async (
  workspaceId: number,
  actorId: number,
  action: string,
  message: string
) => {

  return await prisma.activityLog.create({
    data: {
      workspaceId,
      actorId,
      action,
      message
    }
  });

};


// Get Activity Logs
export const getActivityLogsService = async (userId: number, workspaceId: number) => {

  const workspaceUser = await prisma.workspaceUser.findFirst({
    where: {
      userId,
      workspaceId
    }
  }); // Find current workspace user

  if (!workspaceUser) {
    throw new Error("You do not have access to this workspace.");
  }

  if (workspaceUser.role === Role.member) {
    throw new Error("You do not have permission to view activity logs.");
  }

  const logs = await prisma.activityLog.findMany({
    where: {
      workspaceId
    },
    include: {
      actor: {
        include: {
          user: {
            omit: {
              password: true,
              refreshToken: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  }); // Get activity logs

  return logs;
};