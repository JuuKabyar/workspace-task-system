declare namespace Express {
  interface Request {
    user?: {
      userId: number;
      workspaceId: number | null;
      role: string | null;
    };
  }
}