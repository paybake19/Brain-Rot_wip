import { Request, Response, NextFunction } from "express";
import { config } from "../config";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : undefined;

  if (!token || token !== config.apiKey) {
    res.status(401).json({ error: "Unauthorized", message: "Invalid or missing API key" });
    return;
  }

  next();
}
