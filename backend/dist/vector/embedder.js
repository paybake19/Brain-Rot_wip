"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.embed = embed;
const ollama_service_1 = require("../services/ollama.service");
const logger_service_1 = require("../services/logger.service");
async function embed(text) {
    try {
        return await ollama_service_1.ollamaService.embed(text);
    }
    catch (err) {
        logger_service_1.logger.error("embed failed", { error: err.message });
        throw err;
    }
}
