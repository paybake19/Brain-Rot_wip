"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vaultReindexJob = exports.VaultReindexJob = void 0;
const obsidian_service_1 = require("../../services/obsidian.service");
const chunker_1 = require("../../vector/chunker");
const embedder_1 = require("../../vector/embedder");
const store_1 = require("../../vector/store");
const logger_service_1 = require("../../services/logger.service");
class VaultReindexJob {
    async run() {
        logger_service_1.logger.info("VaultReindexJob starting");
        const paths = await obsidian_service_1.obsidianService.listNotes();
        let noteCount = 0;
        let chunkCount = 0;
        for (const notePath of paths) {
            try {
                const note = await obsidian_service_1.obsidianService.readNote(notePath);
                const chunks = (0, chunker_1.chunkMarkdown)(notePath, note.content);
                const vectors = await Promise.all(chunks.map((c) => (0, embedder_1.embed)(c.content)));
                await (0, store_1.deleteNote)(notePath);
                await (0, store_1.upsertChunks)(chunks, vectors);
                noteCount++;
                chunkCount += chunks.length;
            }
            catch (err) {
                logger_service_1.logger.error("Reindex failed for note", { notePath, error: err.message });
            }
        }
        logger_service_1.logger.info("VaultReindexJob complete", { noteCount, chunkCount });
    }
}
exports.VaultReindexJob = VaultReindexJob;
exports.vaultReindexJob = new VaultReindexJob();
