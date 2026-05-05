import { Request, Response, NextFunction } from "express";
import { logger } from "../services/logger.service";

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  logger.error("Unhandled error", {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
  });
}
