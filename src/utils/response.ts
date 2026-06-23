// API response ကို ပုံစံတူအောင် ပြန်ပေးဖို့ 

import { Response } from "express";

export const successResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data?: object
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (
  res: Response,
  statusCode: number,
  message: string
) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};