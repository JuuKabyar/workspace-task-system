// Check if user is logged in and has a valid access token

import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { errorResponse } from "../utils/response";

export const authMiddleware = (req: Request,res: Response,next: NextFunction) => {
  const authHeader = req.headers.authorization; // Get Authorization header

  if(!authHeader){
    return errorResponse(res, 401, "Access Token Require.")
  }

  const accessToken = authHeader.split(" ")[1]; // Extract access token

  if(!accessToken){
    return errorResponse(res, 401, "Invalid Token Format.")
  }

  try {
    const decoded = verifyAccessToken(accessToken) as {
      userId: number,
      workspaceId: number,
      role: string
    } // Verify access token

    req.user = decoded; // Save token payload in request

    next(); // Continue to next controller
  } catch (error) {

    return errorResponse(res, 401, "Invalid Or Expired Access Token.")
  }
}