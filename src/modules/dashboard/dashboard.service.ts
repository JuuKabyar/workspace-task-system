import { prisma } from "../../lib/prisma";


// Get Owner/Admin Dashboard
export const getAdminDashboardService = async (userId: number, workspaceId: number) => {

  const workspaceUser = await prisma.workspaceUser.findFirst({
    where: {
      userId: userId,
      workspaceId: workspaceId
    }
  }); // Find current workspace user

  if (!workspaceUser) {
    throw new Error("You do not have access to this workspace.");
  }

  const members = await prisma.workspaceUser.findMany({
    where: {
      workspaceId: workspaceId
    },
    include: {
      user: {
        omit: {
          password: true,
          refreshToken: true
        }
      }
    }
  }); // Get members

  const projects = await prisma.project.findMany({
    where: {
      workspaceId: workspaceId
    },
    include: {
      members: {
        include: {
          workspaceUser: {
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
      }
    }
  }); // Get projects

  const tasks = await prisma.task.findMany({
    where: {
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
  }); // Get tasks

  const completedTasks = tasks.filter(task => task.status === "done");
  const pendingTasks = tasks.filter(task => task.status === "todo" || task.status === "in_progress");
  const overdueTasks = tasks.filter(task => task.dueDate && task.dueDate < new Date() && task.status !== "done");

  return {
    totalMembers: {
      count: members.length,
      members: members
    },
    totalProjects: {
      count: projects.length,
      projects: projects
    },
    totalTasks: {
      count: tasks.length,
      tasks: tasks
    },
    completedTasks: {
      count: completedTasks.length,
      tasks: completedTasks
    },
    pendingTasks: {
      count: pendingTasks.length,
      tasks: pendingTasks
    },
    overdueTasks: {
      count: overdueTasks.length,
      tasks: overdueTasks
    }
  };

};


// Get Member Dashboard
export const getMemberDashboardService = async (userId: number, workspaceId: number) => {

  const workspaceUser = await prisma.workspaceUser.findFirst({
    where: {
      userId: userId,
      workspaceId: workspaceId
    }
  }); // Find current workspace user

  if (!workspaceUser) {
    throw new Error("You do not have access to this workspace.");
  }

  const assignedProjects = await prisma.project.findMany({
    where: {
      workspaceId: workspaceId,
      members: {
        some: {
          workspaceUserId: workspaceUser.id
        }
      }
    },
    include: {
      members: {
        include: {
          workspaceUser: {
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
      }
    }
  }); // Get assigned projects

  const assignedTasks = await prisma.task.findMany({
    where: {
      assigneeId: workspaceUser.id,
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
  }); // Get assigned tasks

  const completedAssignedTasks = assignedTasks.filter(task => task.status === "done");
  const pendingAssignedTasks = assignedTasks.filter(task => task.status === "todo" || task.status === "in_progress");

  return {
    assignedProjects: {
      count: assignedProjects.length,
      projects: assignedProjects
    },
    assignedTasks: {
      count: assignedTasks.length,
      tasks: assignedTasks
    },
    completedAssignedTasks: {
      count: completedAssignedTasks.length,
      tasks: completedAssignedTasks
    },
    pendingAssignedTasks: {
      count: pendingAssignedTasks.length,
      tasks: pendingAssignedTasks
    }
  };

};