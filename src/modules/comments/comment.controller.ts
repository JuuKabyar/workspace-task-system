import { Request, Response, NextFunction } from "express";

import { createCommentService, getTaskCommentsService } from "./comment.service";

import { successResponse } from "../../utils/response";


// Create Comment
export const createComment = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const workspaceId = Number(req.params.workspaceId);
    const taskId = Number(req.params.taskId);

    if (!workspaceId) {
      throw new Error("Workspace id is required.");
    }

    if (!taskId) {
      throw new Error("Task id is required.");
    }

    const result = await createCommentService(
      req.user!.userId,
      workspaceId,
      taskId,
      req.body.content
    ); // Create comment

    return successResponse(res, 201, "Comment created successfully.", result);

  } catch (error) {
    next(error);
  }
};


// Get Task Comments
export const getTaskComments = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const workspaceId = Number(req.params.workspaceId);
    const taskId = Number(req.params.taskId);

    if (!workspaceId) {
      throw new Error("Workspace id is required.");
    }

    if (!taskId) {
      throw new Error("Task id is required.");
    }

    const result = await getTaskCommentsService(req.user!.userId, workspaceId, taskId); // Get comments

    return successResponse(res, 200, "Comments fetched successfully.", result);

  } catch (error) {
    next(error);
  }
};