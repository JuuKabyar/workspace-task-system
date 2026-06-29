import { Request, Response, NextFunction } from "express";

import { createTaskService, getTasksService, getTaskByIdService, updateTaskService, updateMyTaskStatusService, deleteTaskService } from "./task.service";

import { successResponse } from "../../utils/response";


// Create Task
export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const workspaceId = Number(req.params.workspaceId);
    const projectId = Number(req.params.projectId);

    if (!workspaceId) {
      throw new Error("Workspace id is required.");
    }

    if (!projectId) {
      throw new Error("Project id is required.");
    }

    const result = await createTaskService(
      req.user!.userId,
      workspaceId,
      projectId,
      req.body.title,
      req.body.description,
      req.body.assigneeId,
      req.body.priority,
      req.body.dueDate
    ); // Create task

    return successResponse(res, 201, "Task created successfully.", result);

  } catch (error) {
    next(error);
  }
};


// Get Tasks
export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const workspaceId = Number(req.params.workspaceId);

    if (!workspaceId) {
      throw new Error("Workspace id is required.");
    }

    const result = await getTasksService(req.user!.userId, workspaceId); // Get tasks

    return successResponse(res, 200, "Tasks fetched successfully.", result);

  } catch (error) {
    next(error);
  }
};


// Get Task By Id
export const getTaskById = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const workspaceId = Number(req.params.workspaceId);
    const taskId = Number(req.params.taskId);

    if (!workspaceId) {
      throw new Error("Workspace id is required.");
    }

    if (!taskId) {
      throw new Error("Task id is required.");
    }

    const result = await getTaskByIdService(req.user!.userId, workspaceId, taskId); // Get task

    return successResponse(res, 200, "Task fetched successfully.", result);

  } catch (error) {
    next(error);
  }
};


// Update Task
export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const workspaceId = Number(req.params.workspaceId);
    const taskId = Number(req.params.taskId);

    if (!workspaceId) {
      throw new Error("Workspace id is required.");
    }

    if (!taskId) {
      throw new Error("Task id is required.");
    }

    const result = await updateTaskService(
      req.user!.userId,
      workspaceId,
      taskId,
      req.body.title,
      req.body.description,
      req.body.assigneeId,
      req.body.priority,
      req.body.status,
      req.body.dueDate
    ); // Update task

    return successResponse(res, 200, "Task updated successfully.", result);

  } catch (error) {
    next(error);
  }
};


// Update My Task Status
export const updateMyTaskStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const workspaceId = Number(req.params.workspaceId);
    const taskId = Number(req.params.taskId);

    if (!workspaceId) {
      throw new Error("Workspace id is required.");
    }

    if (!taskId) {
      throw new Error("Task id is required.");
    }

    const result = await updateMyTaskStatusService(
      req.user!.userId,
      workspaceId,
      taskId,
      req.body.status
    ); // Update my task status

    return successResponse(res, 200, "Task status updated successfully.", result);

  } catch (error) {
    next(error);
  }
};


// Delete Task
export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const workspaceId = Number(req.params.workspaceId);
    const taskId = Number(req.params.taskId);

    if (!workspaceId) {
      throw new Error("Workspace id is required.");
    }

    if (!taskId) {
      throw new Error("Task id is required.");
    }

    const result = await deleteTaskService(
      req.user!.userId,
      workspaceId,
      taskId
    ); // Delete task

    return successResponse(res, 200, "Task deleted successfully.", result);

  } catch (error) {
    next(error);
  }
};