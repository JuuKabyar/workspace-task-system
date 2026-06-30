import { Request, Response, NextFunction } from "express";
import { createProjectService, getProjectsService, getProjectByIdService, updateProjectService, deleteProjectService, assignMemberToProjectService, removeMemberFromProjectService } from "./project.service";
import { successResponse } from "../../utils/response";
import { ProjectStatus } from "../../../generated/prisma/client";

// Create Project
export const createProject = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const workspaceId = Number(req.params.workspaceId);

    if (!workspaceId) {
      throw new Error("Workspace id is required.");
    }

    const result = await createProjectService(
      req.user!.userId,
      workspaceId,
      req.body.name,
      req.body.description,
      req.body.startDate,
      req.body.endDate
    ); // Create project

    return successResponse(res, 201, "Project created successfully.", result);

  } catch (error) {
    next(error);
  }
};


// Get Projects
// Get Projects
export const getProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const workspaceId = Number(req.params.workspaceId);
    const search = req.query.search as string;
    const status = req.query.status as string;

    if (!workspaceId) {
      throw new Error("Workspace id is required.");
    }

    const result = await getProjectsService(req.user!.userId, workspaceId, search, status); // Get projects

    return successResponse(res, 200, "Projects fetched successfully.", result);

  } catch (error) {
    next(error);
  }
};


// Get Project By Id
export const getProjectById = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const workspaceId = Number(req.params.workspaceId);
    const projectId = Number(req.params.projectId);

    if (!workspaceId) {
      throw new Error("Workspace id is required.");
    }

    if (!projectId) {
      throw new Error("Project id is required.");
    }

    const result = await getProjectByIdService(req.user!.userId, workspaceId, projectId); // Get project

    return successResponse(res, 200, "Project fetched successfully.", result);

  } catch (error) {
    next(error);
  }
};


// Update Project
export const updateProject = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const workspaceId = Number(req.params.workspaceId);
    const projectId = Number(req.params.projectId);

    if (!workspaceId) {
      throw new Error("Workspace id is required.");
    }

    if (!projectId) {
      throw new Error("Project id is required.");
    }

    const result = await updateProjectService(
      req.user!.userId,
      workspaceId,
      projectId,
      req.body.name,
      req.body.description,
      req.body.status,
      req.body.startDate,
      req.body.endDate
    ); // Update project

    return successResponse(res, 200, "Project updated successfully.", result);

  } catch (error) {
    next(error);
  }
};


// Delete Project
export const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const workspaceId = Number(req.params.workspaceId);
    const projectId = Number(req.params.projectId);

    if (!workspaceId) {
      throw new Error("Workspace id is required.");
    }

    if (!projectId) {
      throw new Error("Project id is required.");
    }

    const result = await deleteProjectService(req.user!.userId, workspaceId, projectId); // Delete project

    return successResponse(res, 200, "Project deleted successfully.", result);

  } catch (error) {
    next(error);
  }
};


// Assign Member To Project
export const assignMemberToProject = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const workspaceId = Number(req.params.workspaceId);
    const projectId = Number(req.params.projectId);

    if (!workspaceId) {
      throw new Error("Workspace id is required.");
    }

    if (!projectId) {
      throw new Error("Project id is required.");
    }

    const result = await assignMemberToProjectService(
      req.user!.userId,
      workspaceId,
      projectId,
      req.body.workspaceUserId
    ); // Assign member

    return successResponse(res, 200, "Member assigned to project successfully.", result);

  } catch (error) {
    next(error);
  }
};


// Remove Member From Project
export const removeMemberFromProject = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const workspaceId = Number(req.params.workspaceId);
    const projectId = Number(req.params.projectId);
    const workspaceUserId = Number(req.params.workspaceUserId);

    if (!workspaceId) {
      throw new Error("Workspace id is required.");
    }

    if (!projectId) {
      throw new Error("Project id is required.");
    }

    if (!workspaceUserId) {
      throw new Error("Workspace user id is required.");
    }

    const result = await removeMemberFromProjectService(req.user!.userId, workspaceId, projectId, workspaceUserId); // Remove member

    return successResponse(res, 200, "Member removed from project successfully.", result);

  } catch (error) {
    next(error);
  }
};