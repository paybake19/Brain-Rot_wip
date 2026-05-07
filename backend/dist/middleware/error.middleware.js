"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = errorMiddleware;
const logger_service_1 = require("../services/logger.service");
function errorMiddleware(err, req, res, _next) {
    logger_service_1.logger.error("Unhandled error", {
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
