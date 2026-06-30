import { prisma } from "../../lib/prisma";
import { Role } from "../../../generated/prisma/client";


// Create Comment
export const createCommentService = async (userId: number, workspaceId: number, taskId: number, content: string) => {
  if (!content) {
    throw new Error("Comment content is required.");
  }

  const workspaceUser = await prisma.workspaceUser.findFirst({
    where: {
      userId: userId,
      workspaceId: workspaceId
    }
  }); // Find current workspace user

  if (!workspaceUser) {
    throw new Error("You do not have access to this workspace.");
  }

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      project: {
        workspaceId: workspaceId
      }
    }
  }); // Find task

  if (!task) {
    throw new Error("Task not found.");
  }

  if (workspaceUser.role === Role.member && task.assigneeId !== workspaceUser.id) {
    throw new Error("You do not have permission to comment on this task.");
  }

  const comment = await prisma.taskComment.create({
    data: {
      content: content,
      taskId: taskId,
      workspaceId: workspaceId,
      authorId: workspaceUser.id
    },
    include: {
      author: {
        include: {
          user: {
            omit: {
              password: true,
              refreshToken: true
            }
          }
        }
      },
      task: true
    }
  }); // Create comment

  return comment;
};


// Get Task Comments
export const getTaskCommentsService = async (userId: number, workspaceId: number, taskId: number) => {
  const workspaceUser = await prisma.workspaceUser.findFirst({
    where: {
      userId: userId,
      workspaceId: workspaceId
    }
  }); // Find current workspace user

  if (!workspaceUser) {
    throw new Error("You do not have access to this workspace.");
  }

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      project: {
        workspaceId: workspaceId
      }
    }
  }); // Find task

  if (!task) {
    throw new Error("Task not found.");
  }

  if (workspaceUser.role === Role.member && task.assigneeId !== workspaceUser.id) {
    throw new Error("You do not have permission to view comments on this task.");
  }

  const comments = await prisma.taskComment.findMany({
    where: {
      taskId: taskId,
      workspaceId: workspaceId
    },
    include: {
      author: {
        include: {
          user: {
            omit: {
              password: true,
              refreshToken: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  }); // Get comments

  return comments;
};