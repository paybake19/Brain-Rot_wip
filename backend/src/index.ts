import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import * as path from "path";
import helmet from "helmet";

// --- Configuration Loading ---
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const app: Application = express();
const PORT = process.env.PORT || 3001;

// --- Middleware Setup ---
app.use(helmet());
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// --- Route Imports ---
import chatRouter from "./routes/chat.route";
import vaultRouter from "./routes/vault.route";
import toolsRouter from "./routes/tools.route";
import sttRouter from "./routes/stt.route";
import visionRouter from "./routes/vision.route";
import browserRouter from "./routes/browser.route";
import systemRouter from "./routes/system.route";
import calendarRouter from "./routes/calendar.route";

// --- Middleware Imports ---
import { authMiddleware } from "./middleware/auth.middleware";
import { rateLimitMiddleware } from "./middleware/rateLimit.middleware";
import { errorMiddleware } from "./middleware/error.middleware";

// --- Vector / Watcher / Scheduler Imports ---
import { initVectorStore } from "./vector/store";
import { startVaultWatcher } from "./vector/watcher";
import { startScheduler } from "./scheduler/cron";
import { registerTriggers } from "./scheduler/triggers";
import { logger } from "./services/logger.service";

// --- Rate Limiting (global) ---
app.use(rateLimitMiddleware);

// --- Public Routes (no auth) ---
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    message: "BrainRot Backend Service Running",
    status: "ok",
    version: "0.1.0",
  });
});

app.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "Ready to Party",
    model: process.env.OLLAMA_MODEL_DEFAULT,
    timestamp: new Date().toISOString(),
  });
});

// --- Authenticated API Routes ---
app.use("/api/v1", authMiddleware);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/vault", vaultRouter);
app.use("/api/v1/tools", toolsRouter);
app.use("/api/v1/stt", sttRouter);
app.use("/api/v1/vision", visionRouter);
app.use("/api/v1/browser", browserRouter);
app.use("/api/v1/system", systemRouter);
app.use("/api/v1/calendar", calendarRouter);

// --- 404 Handler ---
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route [${req.method}] ${req.originalUrl} does not exist.`,
  });
});

// --- Global Error Handler (must be last) ---
app.use(errorMiddleware);

// --- Bootstrap ---
const startServer = async (): Promise<void> => {
  try {
    await initVectorStore();
    logger.info("✅ Vector store initialized");

    startVaultWatcher();
    logger.info("✅ Vault watcher started");

    registerTriggers();
    logger.info("✅ Event triggers registered");

    startScheduler();
    logger.info("✅ Scheduler started");

    app.listen(PORT, () => {
      logger.info(`\n============================================`);
      logger.info(`✨ 🚀 BrainRot Backend initialized`);
      logger.info(`   http://localhost:${PORT}`);
      logger.info(`   Model: ${process.env.OLLAMA_MODEL_DEFAULT}`);
      logger.info(`============================================\n`);
    });
  } catch (err) {
    logger.error("❌ Failed to start server", { error: err });
    process.exit(1);
  }
};

startServer();
