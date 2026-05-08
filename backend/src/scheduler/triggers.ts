import { bus } from "../events/bus";
import { logger } from "../services/logger.service";

export function registerTriggers(): void {
  bus.on("vault:changed", ({ path }) => {
    // Vector reindex removed — using Obsidian native search instead.
    // Re-wire here if semantic vector search is added in a future phase.
    logger.info("Trigger: vault changed", { path });
  });

  bus.on("tts:speak", ({ text }) => {
    // TTS will be wired here when Piper binary is ready
    logger.info("TTS queued", { preview: text.slice(0, 80) });
  });

  bus.on("stt:result", ({ transcript, sessionId }) => {
    logger.info("STT result received", { sessionId, preview: transcript.slice(0, 80) });
    // Forward into chat pipeline here when frontend WS is wired
  });
}
