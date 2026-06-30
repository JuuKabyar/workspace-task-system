import { Request, Response, NextFunction } from "express";
import { getActivityLogsService } from "./activityLog.service";
import { successResponse } from "../../utils/response";

// Get Activity Logs
export const getActivityLogs = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const workspaceId = Number(req.params.workspaceId);

    if (!workspaceId) {
      throw new Error("Workspace id is required.");
    }

    const result = await getActivityLogsService(req.user!.userId, workspaceId); // Get activity logs

    return successResponse(res, 200, "Activity logs fetched successfully.", result);

  } catch (error) {
    next(error);
  }
};