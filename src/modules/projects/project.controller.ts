import { Request, Response, NextFunction } from "express";
import { createProjectService, 
    getProjectsService, 
    getProjectByIdService, 
    updateProjectService, 
    deleteProjectService, 
    assignMemberToProjectService, 
    removeMemberFromProjectService } from "./project.service";
import { successResponse } from "../../utils/response";

// Create Project
export const createProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await createProjectService(
      req.user!.userId,
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
export const getProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getProjectsService(req.user!.userId); // Get projects

    return successResponse(res, 200, "Projects fetched successfully.", result);

  } catch (error) {
    next(error);
  }
};

// Get Project By Id
export const getProjectById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = Number(req.params.projectId);

    const result = await getProjectByIdService(
      req.user!.userId,
      projectId
    ); // Get project

    return successResponse(res, 200, "Project fetched successfully.", result);

  } catch (error) {
    next(error);
  }
};

// Update Project
export const updateProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = Number(req.params.projectId);

    const result = await updateProjectService(
      req.user!.userId,
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
    const projectId = Number(req.params.projectId);

    const result = await deleteProjectService(
      req.user!.userId,
      projectId
    ); // Delete project

    return successResponse(res, 200, "Project deleted successfully.", result);

  } catch (error) {
    next(error);
  }
};

// Assign Member To Project
export const assignMemberToProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const result =
      await assignMemberToProjectService(
        req.user!.userId,
        Number(req.params.projectId),
        req.body.workspaceUserId
      ); // Assign member

    return successResponse(
      res,
      200,
      "Member assigned successfully.",
      result
    );

  } catch (error) {
    next(error);
  }

};

// Remove Member From Project
export const removeMemberFromProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const result =
      await removeMemberFromProjectService(
        req.user!.userId,
        Number(req.params.projectId),
        Number(req.params.workspaceUserId)
      ); // Remove member

    return successResponse(
      res,
      200,
      "Member removed successfully.",
      result
    );

  } catch (error) {
    next(error);
  }

};