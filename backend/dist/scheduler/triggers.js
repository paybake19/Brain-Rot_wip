"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerTriggers = registerTriggers;
const bus_1 = require("../events/bus");
const logger_service_1 = require("../services/logger.service");
function registerTriggers() {
    bus_1.bus.on("vault:changed", ({ path }) => {
        // Vector reindex removed — using Obsidian native search instead.
        // Re-wire here if semantic vector search is added in a future phase.
        logger_service_1.logger.info("Trigger: vault changed", { path });
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
