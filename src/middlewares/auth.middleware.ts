import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";

// Check user authentication
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new Error("Access token is required.");
    }

    if (!authHeader.startsWith("Bearer ")) {
      throw new Error("Invalid token format.");
    }

    const accessToken = authHeader.split(" ")[1];

    if (!accessToken) {
      throw new Error("Access token is required.");
    }

    const decoded = verifyAccessToken(accessToken) as {
      userId: number
    }; // Verify access token

    req.user = {
      userId: decoded.userId
    }; // Save user id in request

    next();

  } catch (error) {
    next(error);
  }
};