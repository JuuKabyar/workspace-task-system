declare namespace Express {
  export interface Request {
    user?: {
      userId: number;
      workspaceId: number;
      role: string;
    };
  }
}