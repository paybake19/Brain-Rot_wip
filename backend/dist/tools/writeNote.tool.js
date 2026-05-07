"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeNoteTool = writeNoteTool;
const obsidian_service_1 = require("../services/obsidian.service");
async function writeNoteTool(args) {
    try {
        await obsidian_service_1.obsidianService.writeNote(args.path, args.content);
        return `Note written successfully to "${args.path}"`;
    }
    catch {
        return `Error: could not write note at path "${args.path}"`;
    }
}
