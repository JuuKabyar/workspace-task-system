// WT token create / verify လုပ်တဲ့ function တွေလုပ်ရမယ်။

import jwt from "jsonwebtoken";

// Create access token
export const generateAccessToken = (
  payload: object
) => {
  const accessToken = jwt.sign(
    payload,
    process.env.JWT_ACCESS_SECRET!,
    {
      expiresIn: "15m",
    }
  );

  return accessToken;
};

// Create refresh token
export const generateRefreshToken = (
  payload: object
) => {
  const refreshToken = jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET!,
    {
      expiresIn: "7d",
    }
  );

  return refreshToken;
};

// Verify access token
export const verifyAccessToken = (
  token: string
) => {
  const decoded = jwt.verify(
    token,
    process.env.JWT_ACCESS_SECRET!
  );

  return decoded;
};

// Verify refresh token
export const verifyRefreshToken = (
  token: string
) => {
  const decoded = jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET!
  );

  return decoded;
};