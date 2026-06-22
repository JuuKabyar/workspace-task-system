// // register success ဖြစ်သွားရင် 

import { Request, Response } from "express";
import { registerService, loginService } from "./auth.service";

const accessCookieOptions = {
  httpOnly: true,
  maxAge: 15 * 60 * 1000,
};

const refreshCookieOptions = {
  httpOnly: true,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const register = async (
  req: Request,
  res: Response
) => {
  try {
    const { workspaceName, name, email, password } =
      req.body;

    const result = await registerService(
      workspaceName,
      name,
      email,
      password
    );

    // Save tokens in cookies
    res.cookie(
      "accessToken",
      result.accessToken,
      accessCookieOptions
    );

    res.cookie(
      "refreshToken",
      result.refreshToken,
      refreshCookieOptions
    );

    res.status(201).json({
      success: true,
      message: "Workspace created successfully",

      // For development only
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,

      user: result.user,
      workspace: result.workspace,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Registration failed",
    });
  }
};

export const login = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    const result = await loginService(email, password);

    // Save tokens in cookies
    res.cookie(
      "accessToken",
      result.accessToken,
      accessCookieOptions
    );

    res.cookie(
      "refreshToken",
      result.refreshToken,
      refreshCookieOptions
    );

    res.status(200).json({
      success: true,
      message: "Login successful",

      // For development only
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,

      user: result.user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Login failed",
    });
  }
};

// logout
export const logout = async (
  req: Request,
  res: Response
) => {
  res.clearCookie("accessToken");

  res.clearCookie("refreshToken");

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};