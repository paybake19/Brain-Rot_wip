"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appendNoteTool = appendNoteTool;
const obsidian_service_1 = require("../services/obsidian.service");
async function appendNoteTool(args) {
    try {
        await obsidian_service_1.obsidianService.appendNote(args.path, args.content);
        return `Content appended to "${args.path}"`;
    }
    catch {
        return `Error: could not append to note at path "${args.path}"`;
    }
}
