"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const path = __importStar(require("path"));
const helmet_1 = __importDefault(require("helmet"));
// --- Route Imports ---
const chat_route_1 = __importDefault(require("./routes/chat.route"));
const vault_route_1 = __importDefault(require("./routes/vault.route"));
const tools_route_1 = __importDefault(require("./routes/tools.route"));
const stt_route_1 = __importDefault(require("./routes/stt.route"));
const tts_route_1 = __importDefault(require("./routes/tts.route"));
const vision_route_1 = __importDefault(require("./routes/vision.route"));
const browser_route_1 = __importDefault(require("./routes/browser.route"));
const system_route_1 = __importDefault(require("./routes/system.route"));
// import calendarRouter from "./routes/calendar.route";
// --- Middleware Imports ---
const auth_middleware_1 = require("./middleware/auth.middleware");
const rateLimit_middleware_1 = require("./middleware/rateLimit.middleware");
const error_middleware_1 = require("./middleware/error.middleware");
// --- Service Imports ---
const cron_1 = require("./scheduler/cron");
const triggers_1 = require("./scheduler/triggers");
const logger_service_1 = require("./services/logger.service");
// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------
dotenv_1.default.config({ path: path.resolve(process.cwd(), ".env") });
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";
// ---------------------------------------------------------------------------
// Global Middleware
// ---------------------------------------------------------------------------
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({ origin: CORS_ORIGIN }));
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(rateLimit_middleware_1.rateLimitMiddleware);
// ---------------------------------------------------------------------------
// Public Routes (no auth)
// ---------------------------------------------------------------------------
app.get("/", (_req, res) => {
    res.status(200).json({
        message: "BrainRot Backend Service Running",
        status: "ok",
        version: "0.1.0",
    });
});
app.get("/health", (_req, res) => {
    res.json({
        status: "Ready to Party",
        model: process.env.OLLAMA_MODEL_DEFAULT,
        timestamp: new Date().toISOString(),
    });
});
// ---------------------------------------------------------------------------
// Authenticated API Routes
// ---------------------------------------------------------------------------
app.use("/api/v1", auth_middleware_1.authMiddleware);
app.use("/api/v1/chat", chat_route_1.default);
app.use("/api/v1/vault", vault_route_1.default);
app.use("/api/v1/tools", tools_route_1.default);
app.use("/api/v1/stt", stt_route_1.default);
app.use("/api/v1/tts", tts_route_1.default);
app.use("/api/v1/vision", vision_route_1.default);
app.use("/api/v1/browser", browser_route_1.default);
app.use("/api/v1/system", system_route_1.default);
//app.use("/api/v1/calendar", calendarRouter);
// ---------------------------------------------------------------------------
// 404 Handler
// ---------------------------------------------------------------------------
app.use((req, res) => {
    res.status(404).json({
        error: "Not Found",
        message: `Route [${req.method}] ${req.originalUrl} does not exist.`,
    });
});
// ---------------------------------------------------------------------------
// Global Error Handler (must be last)
// ---------------------------------------------------------------------------
app.use(error_middleware_1.errorMiddleware);
// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------
const startServer = async () => {
    try {
        (0, triggers_1.registerTriggers)();
        logger_service_1.logger.info("✅ Event triggers registered");
        (0, cron_1.startScheduler)();
        logger_service_1.logger.info("✅ Scheduler started");
        app.listen(PORT, () => {
            logger_service_1.logger.info(`\n============================================`);
            logger_service_1.logger.info(`✨ 🚀 BrainRot Backend initialized`);
            logger_service_1.logger.info(`   http://localhost:${PORT}`);
            logger_service_1.logger.info(`   Model: ${process.env.OLLAMA_MODEL_DEFAULT}`);
            logger_service_1.logger.info(`   CORS:  ${CORS_ORIGIN}`);
            logger_service_1.logger.info(`============================================\n`);
        });
    }
    catch (err) {
        logger_service_1.logger.error("❌ Failed to start server", { error: err });
        process.exit(1);
    }
};
startServer();
