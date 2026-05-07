"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.semanticSearchTool = semanticSearchTool;
const embedder_1 = require("../vector/embedder");
const search_1 = require("../vector/search");
async function semanticSearchTool(args) {
    try {
        const vector = await (0, embedder_1.embed)(args.query);
        const results = await (0, search_1.semanticSearch)(vector, 5);
        if (!results.length)
            return "No semantically similar notes found.";
        return results
            .map((r) => `**${r.path}**\n${r.content.slice(0, 400)}`)
            .join("\n---\n");
    }
    catch {
        return `Error: semantic search failed for query "${args.query}"`;
    }
}
