import { prisma } from "../../lib/prisma";
import { Role, TaskStatus, TaskPriority } from "../../../generated/prisma/client";

// Create Task
export const createTaskService = async (userId: number, workspaceId: number, projectId: number, title: string, description?: string, assigneeId?: number, priority?: TaskPriority, dueDate?: string) => {
  if (!title) {
    throw new Error("Task title is required.");
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

  if (workspaceUser.role === Role.member) {
    throw new Error("Member cannot create task.");
  }

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      workspaceId: workspaceId
    }
  }); // Find project

  if (!project) {
    throw new Error("Project not found.");
  }

  if (assigneeId) {
    const assignee = await prisma.workspaceUser.findFirst({
      where: {
        id: assigneeId,
        workspaceId: workspaceId
      }
    }); // Check assignee

    if (!assignee) {
      throw new Error("Assignee not found in this workspace.");
    }

    const projectMember = await prisma.projectMember.findFirst({
      where: {
        projectId: projectId,
        workspaceUserId: assigneeId
      }
    }); // Check assignee in project

    if (!projectMember) {
      throw new Error("Assignee must be assigned to this project first.");
    }
  }

  const task = await prisma.task.create({
    data: {
      title: title,
      description: description,
      priority: priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      projectId: projectId,
      assigneeId: assigneeId,
      createdById: userId
    }
  }); // Create task

  return task;
};


// Get Tasks
export const getTasksService = async (userId: number, workspaceId: number) => {
  const workspaceUser = await prisma.workspaceUser.findFirst({
    where: {
      userId: userId,
      workspaceId: workspaceId
    }
  }); // Find current workspace user

  if (!workspaceUser) {
    throw new Error("You do not have access to this workspace.");
  }

  const whereCondition = workspaceUser.role === Role.member
    ? {
        project: {
          workspaceId: workspaceId
        },
        assigneeId: workspaceUser.id
      }
    : {
        project: {
          workspaceId: workspaceId
        }
      };

  const tasks = await prisma.task.findMany({
    where: whereCondition,
    include: {
      project: true,
      assignee: {
        include: {
          user: {
            omit: {
              password: true,
              refreshToken: true
            }
          }
        }
      }
    }
  }); // Get tasks

  return tasks;
};


// Get Task By Id
export const getTaskByIdService = async (userId: number, workspaceId: number, taskId: number) => {
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
    },
    include: {
      project: true,
      assignee: {
        include: {
          user: {
            omit: {
              password: true,
              refreshToken: true
            }
          }
        }
      }
    }
  }); // Find task

  if (!task) {
    throw new Error("Task not found.");
  }

  if (workspaceUser.role === Role.member) {
    const projectMember = await prisma.projectMember.findFirst({
      where: {
        projectId: task.projectId,
        workspaceUserId: workspaceUser.id
      }
    }); // Check project member

    if (task.assigneeId !== workspaceUser.id && !projectMember) {
      throw new Error("You do not have permission to view this task.");
    }
  }

  return task;
};


// Update Task
export const updateTaskService = async (userId: number, workspaceId: number, taskId: number, title?: string, description?: string, assigneeId?: number, priority?: TaskPriority, status?: TaskStatus, dueDate?: string) => {
  const workspaceUser = await prisma.workspaceUser.findFirst({
    where: {
      userId: userId,
      workspaceId: workspaceId
    }
  }); // Find current workspace user

  if (!workspaceUser) {
    throw new Error("You do not have access to this workspace.");
  }

  if (workspaceUser.role === Role.member) {
    throw new Error("Member cannot update task details.");
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

  if (assigneeId) {
    const assignee = await prisma.workspaceUser.findFirst({
      where: {
        id: assigneeId,
        workspaceId: workspaceId
      }
    }); // Check assignee

    if (!assignee) {
      throw new Error("Assignee not found in this workspace.");
    }

    const projectMember = await prisma.projectMember.findFirst({
      where: {
        projectId: task.projectId,
        workspaceUserId: assigneeId
      }
    }); // Check assignee in project

    if (!projectMember) {
      throw new Error("Assignee must be assigned to this project first.");
    }
  }

  const updatedTask = await prisma.task.update({
    where: {
      id: taskId
    },
    data: {
      title: title,
      description: description,
      assigneeId: assigneeId,
      priority: priority,
      status: status,
      dueDate: dueDate ? new Date(dueDate) : undefined
    }
  }); // Update task

  return updatedTask;
};


// Update My Task Status
export const updateMyTaskStatusService = async (userId: number, workspaceId: number, taskId: number, status: TaskStatus) => {
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

  if (task.assigneeId !== workspaceUser.id) {
    throw new Error("You can only update status of tasks assigned to you.");
  }

  const updatedTask = await prisma.task.update({
    where: {
      id: taskId
    },
    data: {
      status: status
    }
  }); // Update status

  return updatedTask;
};


// Delete Task
export const deleteTaskService = async (userId: number, workspaceId: number, taskId: number) => {
  const workspaceUser = await prisma.workspaceUser.findFirst({
    where: {
      userId: userId,
      workspaceId: workspaceId
    }
  }); // Find current workspace user

  if (!workspaceUser) {
    throw new Error("You do not have access to this workspace.");
  }

  if (workspaceUser.role === Role.member) {
    throw new Error("Member cannot delete task.");
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

  const deletedTask = await prisma.task.delete({
    where: {
      id: taskId
    }
  }); // Delete task

  return deletedTask;
};