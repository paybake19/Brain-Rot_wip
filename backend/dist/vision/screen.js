"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.captureScreen = captureScreen;
const screenshot_desktop_1 = __importDefault(require("screenshot-desktop"));
const logger_service_1 = require("../services/logger.service");
async function captureScreen() {
    try {
        const buffer = await (0, screenshot_desktop_1.default)({ format: "png" });
        return buffer;
    }
    catch (err) {
        logger_service_1.logger.error("captureScreen failed", { error: err.message });
        throw err;
    }
}
