// Check user authentication

import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {

  const authHeader =
    req.headers.authorization; // Get authorization header

  if (!authHeader) {
    throw new Error("Access token is required.");
  }

  if (!authHeader.startsWith("Bearer ")) {
    throw new Error("Invalid token format.");
  }

  const accessToken =
    authHeader.split(" ")[1]; // Extract access token

  if (!accessToken) {
    throw new Error("Access token is required.");
  }

  try {
    const decoded = verifyAccessToken(accessToken) as {
        userId: number,
        workspaceId: number | null,
        role: string | null
      }; // Verify access token

    req.user = decoded; // Save payload in request

    next();
  } catch (error) {
    next(error);
  }
};