"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeRead = safeRead;
exports.safeWrite = safeWrite;
exports.exists = exists;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const logger_service_1 = require("../services/logger.service");
async function safeRead(filePath) {
    try {
        return await promises_1.default.readFile(filePath, "utf-8");
    }
    catch (err) {
        if (err.code === "ENOENT")
            return null;
        logger_service_1.logger.error("safeRead failed", { filePath, error: err.message });
        throw err;
    }
}
async function safeWrite(filePath, content) {
    await promises_1.default.mkdir(path_1.default.dirname(filePath), { recursive: true });
    await promises_1.default.writeFile(filePath, content, "utf-8");
}
async function exists(filePath) {
    try {
        await promises_1.default.access(filePath);
        return true;
    }
    catch {
        return false;
    }
}
