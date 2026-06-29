import { Request, Response, NextFunction } from "express";
import { getAdminDashboardService, getMemberDashboardService } from "./dashboard.service";
import { successResponse } from "../../utils/response";


// Get Owner/Admin Dashboard
export const getAdminDashboard = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const workspaceId = Number(req.params.workspaceId);

    if (!workspaceId) {
      throw new Error("Workspace id is required.");
    }

    const result = await getAdminDashboardService(req.user!.userId, workspaceId); // Get dashboard

    return successResponse(res, 200, "Dashboard fetched successfully.", result);

  } catch (error) {
    next(error);
  }
};


// Get Member Dashboard
export const getMemberDashboard = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const workspaceId = Number(req.params.workspaceId);

    if (!workspaceId) {
      throw new Error("Workspace id is required.");
    }

    const result = await getMemberDashboardService(req.user!.userId, workspaceId); // Get dashboard

    return successResponse(res, 200, "Dashboard fetched successfully.", result);

  } catch (error) {
    next(error);
  }
};