import { prisma } from "../../lib/prisma";


// Create Notification
export const createNotificationService = async (workspaceId: number, workspaceUserId: number, taskId: number, title: string, message: string) => {

  const notification = await prisma.notification.create({
    data: {
      workspaceId: workspaceId,
      userId: workspaceUserId,
      taskId: taskId,
      title: title,
      message: message
    }
  }); // Create notification

  return notification;
};


// Get Notifications
export const getNotificationsService = async (userId: number, workspaceId: number) => {

  const workspaceUser = await prisma.workspaceUser.findFirst({
    where: {
      userId: userId,
      workspaceId: workspaceId
    }
  }); // Find current workspace user

  if (!workspaceUser) {
    throw new Error("You do not have access to this workspace.");
  }

  const notifications = await prisma.notification.findMany({
    where: {
      workspaceId: workspaceId,
      userId: workspaceUser.id
    },
    include: {
      task: true
    },
    orderBy: {
      createdAt: "desc"
    }
  }); // Get notifications

  return notifications;
};


// Mark Notification As Read
export const markNotificationAsReadService = async (userId: number, workspaceId: number, notificationId: number) => {

  const workspaceUser = await prisma.workspaceUser.findFirst({
    where: {
      userId: userId,
      workspaceId: workspaceId
    }
  }); // Find current workspace user

  if (!workspaceUser) {
    throw new Error("You do not have access to this workspace.");
  }

  const notification = await prisma.notification.findFirst({
    where: {
      id: notificationId,
      workspaceId: workspaceId,
      userId: workspaceUser.id
    }
  }); // Find notification

  if (!notification) {
    throw new Error("Notification not found.");
  }

  const updatedNotification = await prisma.notification.update({
    where: {
      id: notificationId
    },
    data: {
      isRead: true
    }
  }); // Mark as read

  return updatedNotification;
};