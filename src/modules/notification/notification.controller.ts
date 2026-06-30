import { Request, Response, NextFunction } from "express";
import { getNotificationsService, markNotificationAsReadService } from "./notification.service";
import { successResponse } from "../../utils/response";


// Get Notifications
export const getNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const workspaceId = Number(req.params.workspaceId);

    if (!workspaceId) {
      throw new Error("Workspace id is required.");
    }

    const result = await getNotificationsService(req.user!.userId, workspaceId); // Get notifications

    return successResponse(res, 200, "Notifications fetched successfully.", result);

  } catch (error) {
    next(error);
  }
};


// Mark Notification As Read
export const markNotificationAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const workspaceId = Number(req.params.workspaceId);
    const notificationId = Number(req.params.notificationId);

    if (!workspaceId) {
      throw new Error("Workspace id is required.");
    }

    if (!notificationId) {
      throw new Error("Notification id is required.");
    }

    const result = await markNotificationAsReadService(req.user!.userId, workspaceId, notificationId); // Mark as read

    return successResponse(res, 200, "Notification marked as read successfully.", result);

  } catch (error) {
    next(error);
  }
};