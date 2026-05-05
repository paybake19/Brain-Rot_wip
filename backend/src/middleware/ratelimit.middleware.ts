import rateLimit from "express-rate-limit";

export const rateLimitMiddleware = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({
      error: "Rate limit exceeded",
      message: "Too many requests, slow down.",
    });
  },
});
