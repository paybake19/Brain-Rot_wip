import { obsidianService } from "../../services/obsidian.service";
import { chunkMarkdown } from "../../vector/chunker";
import { embed } from "../../vector/embedder";
import { upsertChunks, deleteNote } from "../../vector/store";
import { logger } from "../../services/logger.service";

export class VaultReindexJob {
  async run(): Promise<void> {
    logger.info("VaultReindexJob starting");
    const paths = await obsidianService.listNotes();
    let noteCount = 0;
    let chunkCount = 0;

    for (const notePath of paths) {
      try {
        const note = await obsidianService.readNote(notePath);
        const chunks = chunkMarkdown(notePath, note.content);
        const vectors = await Promise.all(chunks.map((c) => embed(c.content)));
        await deleteNote(notePath);
        await upsertChunks(chunks, vectors);
        noteCount++;
        chunkCount += chunks.length;
      } catch (err: any) {
        logger.error("Reindex failed for note", { notePath, error: err.message });
      }
    }

    logger.info("VaultReindexJob complete", { noteCount, chunkCount });
  }
}

export const vaultReindexJob = new VaultReindexJob();
