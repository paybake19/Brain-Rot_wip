"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.describeImage = describeImage;
const ollama_service_1 = require("../services/ollama.service");
const logger_service_1 = require("../services/logger.service");
async function describeImage(image) {
    try {
        const base64 = image.toString("base64");
        const description = await ollama_service_1.ollamaService.generate("Describe what you see in this image in detail.", base64);
        return description;
    }
    catch (err) {
        logger_service_1.logger.error("describeImage failed", { error: err.message });
        throw err;
    }
}
