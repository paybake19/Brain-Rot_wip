"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readNoteTool = readNoteTool;
const obsidian_service_1 = require("../services/obsidian.service");
const logger_service_1 = require("../services/logger.service");
async function readNoteTool(args) {
    try {
        const note = await obsidian_service_1.obsidianService.readNote(args.path);
        return note.content;
    }
    catch (err) {
        logger_service_1.logger.error("readNoteTool failed", { path: args.path, error: err.message });
        return `Error: could not read note at path "${args.path}" — ${err.message}`;
    }
}
