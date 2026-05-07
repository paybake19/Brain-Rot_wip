"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerTriggers = registerTriggers;
const bus_1 = require("../events/bus");
const logger_service_1 = require("../services/logger.service");
const chunker_1 = require("../vector/chunker");
const embedder_1 = require("../vector/embedder");
const store_1 = require("../vector/store");
const promises_1 = __importDefault(require("fs/promises"));
function registerTriggers() {
    bus_1.bus.on("vault:changed", async ({ path }) => {
        logger_service_1.logger.info("Trigger: vault changed — reindexing", { path });
        try {
            const content = await promises_1.default.readFile(path, "utf-8");
            const relativePath = path.replace(/\\/g, "/").split("/").slice(-3).join("/");
            const chunks = (0, chunker_1.chunkMarkdown)(relativePath, content);
            const vectors = await Promise.all(chunks.map((c) => (0, embedder_1.embed)(c.content)));
            await (0, store_1.deleteNote)(relativePath);
            await (0, store_1.upsertChunks)(chunks, vectors);
        }
        catch (err) {
            logger_service_1.logger.error("Trigger reindex failed", { path, error: err.message });
        }
    });
    bus_1.bus.on("tts:speak", ({ text }) => {
        // TTS will be wired here when Piper binary is ready
        logger_service_1.logger.info("TTS queued", { preview: text.slice(0, 80) });
    });
    bus_1.bus.on("stt:result", ({ transcript, sessionId }) => {
        logger_service_1.logger.info("STT result received", { sessionId, preview: transcript.slice(0, 80) });
        // Forward into chat pipeline here when frontend WS is wired
    });
}
