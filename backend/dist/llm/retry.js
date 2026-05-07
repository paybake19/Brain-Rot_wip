"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withRetry = withRetry;
const sleep_1 = require("../utils/sleep");
const logger_service_1 = require("../services/logger.service");
async function withRetry(fn, maxAttempts = 3, delayMs = 500) {
    let lastError = new Error("Unknown error");
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        }
        catch (err) {
            lastError = err;
            logger_service_1.logger.warn(`Attempt ${attempt}/${maxAttempts} failed`, { error: err.message });
            if (attempt < maxAttempts)
                await (0, sleep_1.sleep)(delayMs * attempt);
        }
    }
    throw lastError;
}
