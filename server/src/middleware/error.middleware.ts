import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export const errorMiddleware = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error("KARYO API ERROR:", err);

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });

    return;
  }

  if (err instanceof Error) {
    const isSensitive =
      /mongodb|mongo|password|secret|key|token|connection|driver|econnrefused/i.test(
        err.message
      );

    res.status(500).json({
      success: false,
      message: isSensitive
        ? "An internal server error occurred. Please try again later."
        : err.message || "An unexpected error occurred.",
    });

    return;
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};