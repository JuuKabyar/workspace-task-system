import { Request, Response } from "express";
import { registerService, loginService, refreshTokenService } from "./auth.service";
import { successResponse, errorResponse } from "../../utils/response";

// Register
export const register = async (req: Request, res: Response) => {
  const workspaceName = req.body.workspaceName;
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  try {
    const result = await registerService(
        workspaceName,
        name,
        email,
        password
    ) // Create workspace and owner user

    res.cookie("accessToken", result.accessToken,{
      httpOnly: true,
      maxAge: 15 * 60 * 1000
    }) // Save access token in cookie

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000
    }) // Save refresh token in cookie

    return successResponse(res, 201, "Register Successful.", result)

  } catch (error) {
    return errorResponse(res, 400,
      error instanceof Error
          ? error.message
          : "Register Failed."
    )
  }
}

// Login
export const login = async (req: Request, res: Response) => {
  const userIdFromToken = req.user?.userId; // Get user id from token
  const email = req.body.email;
  const password = req.body.password;

  try {
    const result = await loginService(email, password) // Check email and password

    if(result.id !== userIdFromToken){
      return errorResponse(res, 401, "This Token Does Not Belong To This Account.")
    }

    return successResponse(res, 200, "Login Successful.", result)

  } catch (error) {
    return errorResponse(res, 400,
      error instanceof Error
          ? error.message
          : "Login Failed."
    )
  }
}

// Refresh Token
export const refreshToken = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization; // Get Authorization header

  if(!authHeader){
    return errorResponse(res, 401, "Refresh Token Require.")
  }

  const refreshToken = authHeader.split(" ")[1]; // Extract refresh token

  try {
    const result = await refreshTokenService(refreshToken) // Generate new access token

    return successResponse(res, 200, "Access Token Refreshed Successfully.", result)

  } catch (error) {

    return errorResponse(res, 401, "Invalid Or Expired Refresh Token.")
  }
}

// Logout
export const logout = async (req: Request, res: Response) => {
  const userId = req.user?.userId; // Get current user id

  console.log(userId) 

  res.clearCookie("accessToken"); // Remove access token
  res.clearCookie("refreshToken"); // Remove refresh token

  return successResponse(res, 200, "Logout Successful.")
}