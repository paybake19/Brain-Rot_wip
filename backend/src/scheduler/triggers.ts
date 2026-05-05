import { bus } from "../events/bus";
import { logger } from "../services/logger.service";
import { obsidianService } from "../services/obsidian.service";
import { chunkMarkdown } from "../vector/chunker";
import { embed } from "../vector/embedder";
import { upsertChunks, deleteNote } from "../vector/store";
import fs from "fs/promises";

export function registerTriggers(): void {
  bus.on("vault:changed", async ({ path }) => {
    logger.info("Trigger: vault changed — reindexing", { path });
    try {
      const content = await fs.readFile(path, "utf-8");
      const relativePath = path.replace(/\\/g, "/").split("/").slice(-3).join("/");
      const chunks = chunkMarkdown(relativePath, content);
      const vectors = await Promise.all(chunks.map((c) => embed(c.content)));
      await deleteNote(relativePath);
      await upsertChunks(chunks, vectors);
    } catch (err: any) {
      logger.error("Trigger reindex failed", { path, error: err.message });
    }
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
