import { Request, Response, NextFunction } from "express";

// Global error handler middleware for Express
export default function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error("Error:", err);

  const statusCode =
    err.statusCode && typeof err.statusCode === "number"
      ? err.statusCode
      : 500;
  const message =
    typeof err.message === "string"
      ? err.message
      : "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
  });
}
