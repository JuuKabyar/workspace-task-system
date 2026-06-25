import { Request, Response, NextFunction } from "express";

export const errorMiddleware = (error: any, req: Request, res: Response, next: NextFunction) => {

    console.log(error)
    console.error("Server Error:", error);

  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal Server Error",
    errorCode: error.code || "SERVER_ERROR"
  });
};