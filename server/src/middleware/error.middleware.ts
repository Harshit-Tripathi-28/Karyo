import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";

export const errorMiddleware = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(error);

  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });

    return;
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};