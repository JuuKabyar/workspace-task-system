import { Request, Response, NextFunction } from "express";
import { createWorkspaceService, getWorkspaceService, updateWorkspaceService, deleteWorkspaceService } from "./workspace.service";
import { successResponse } from "../../utils/response";

// Create Workspace
export const createWorkspace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      throw new Error("Unauthorized.");
    }

    const result = await createWorkspaceService(
      userId,
      req.body.name
    ); // Create workspace

    return successResponse(res, 201, "Workspace created successfully.", result);

  } catch (error) {
    next(error);
  }
};

// Get Workspace
export const getWorkspace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = req.user?.workspaceId;

    if (!workspaceId) {
      throw new Error("Workspace not found.");
    }

    const result = await getWorkspaceService(workspaceId); // Find workspace

    return successResponse(res, 200, "Workspace fetched successfully.", result);

  } catch (error) {
    next(error);
  }
};

// Update Workspace
export const updateWorkspace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = req.user?.workspaceId;

    if (!workspaceId) {
      throw new Error("Workspace not found.");
    }

    const result = await updateWorkspaceService(
      workspaceId,
      req.body.name
    ); // Update workspace

    return successResponse(res, 200, "Workspace updated successfully.", result);

  } catch (error) {
    next(error);
  }
};

// Delete Workspace
export const deleteWorkspace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = req.user?.workspaceId;

    if (!workspaceId) {
      throw new Error("Workspace not found.");
    }

    const result = await deleteWorkspaceService(workspaceId); // Delete workspace

    return successResponse(res, 200, "Workspace deleted successfully.", result);

  } catch (error) {
    next(error);
  }
};