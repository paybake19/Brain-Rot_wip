"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.describeImage = describeImage;
const ollama_service_1 = require("../services/ollama.service");
const vision_prompt_1 = require("../llm/prompts/vision.prompt");
async function describeImage(imageBuffer) {
    const base64 = imageBuffer.toString("base64");
    return ollama_service_1.ollamaService.generate((0, vision_prompt_1.buildVisionPrompt)(), base64);
}
