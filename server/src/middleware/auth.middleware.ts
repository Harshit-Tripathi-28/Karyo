import { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "../types/express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { ApiError } from "../utils/ApiError";

interface JwtPayload {
  userId: string;
}

export const authenticate = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    throw new ApiError(401, "Authentication required");
  }

  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      env.jwtSecret
    ) as JwtPayload;

    if (!decoded.userId) {
      throw new ApiError(
        401,
        "Invalid authentication token"
      );
    }

    req.userId = decoded.userId;

    next();
  } catch {
    throw new ApiError(
      401,
      "Invalid or expired authentication token"
    );
  }
};