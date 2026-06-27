import { Request, Response, NextFunction } from "express";
import { createWorkspaceService, getMyWorkspacesService, getWorkspaceService, updateWorkspaceService, deleteWorkspaceService } from "./workspace.service";
import { successResponse } from "../../utils/response";

// Create Workspace
export const createWorkspace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await createWorkspaceService(
      req.user!.userId,
      req.body.name
    ); // Create workspace

    return successResponse(res, 201, "Workspace created successfully.", result);

  } catch (error) {
    next(error);
  }
};

// Get My Workspaces
export const getMyWorkspaces = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getMyWorkspacesService(req.user!.userId); // Get workspaces

    return successResponse(res, 200, "Workspaces fetched successfully.", result);

  } catch (error) {
    next(error);
  }
};

// Get Workspace By Id
export const getWorkspace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = Number(req.params.workspaceId);

    if (!workspaceId) {
      throw new Error("Workspace id is required.");
    }

    const result = await getWorkspaceService(
      req.user!.userId,
      workspaceId
    ); // Get workspace

    return successResponse(res, 200, "Workspace fetched successfully.", result);

  } catch (error) {
    next(error);
  }
};

// Update Workspace
export const updateWorkspace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = Number(req.params.workspaceId);

    if (!workspaceId) {
      throw new Error("Workspace id is required.");
    }

    const result = await updateWorkspaceService(
      req.user!.userId,
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
    const workspaceId = Number(req.params.workspaceId);

    if (!workspaceId) {
      throw new Error("Workspace id is required.");
    }

    const result = await deleteWorkspaceService(
      req.user!.userId,
      workspaceId
    ); // Delete workspace

    return successResponse(res, 200, "Workspace deleted successfully.", result);

  } catch (error) {
    next(error);
  }
};