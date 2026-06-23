// ckeck roles

import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils/response";

export const roleMiddleware = (roles: string[]) => {

  return (req: Request, res: Response, next: NextFunction) => {

    const userRole = req.user?.role; // Get user role from token

    if(!userRole){
      return errorResponse(res, 401, "User Role Not Found.")
    }

    if(!roles.includes(userRole)){
      return errorResponse(res, 403, "Access Denied.")
    }

    next(); // Continue to next controller
  }
}