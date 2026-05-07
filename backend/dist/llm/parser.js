"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseToolCalls = parseToolCalls;
const logger_service_1 = require("../services/logger.service");
const crypto_1 = __importDefault(require("crypto"));
function parseToolCalls(rawOutput) {
    const regex = /<tool_call>([\s\S]*?)<\/tool_call>/g;
    const calls = [];
    let match;
    while ((match = regex.exec(rawOutput)) !== null) {
        try {
            const parsed = JSON.parse(match[1].trim());
            calls.push({
                id: crypto_1.default.randomUUID(),
                name: parsed.name,
                arguments: parsed.arguments ?? {},
            });
        }
        catch (err) {
            logger_service_1.logger.warn("Failed to parse tool call JSON", { raw: match[1], error: err.message });
        }
    }
    return calls;
}
