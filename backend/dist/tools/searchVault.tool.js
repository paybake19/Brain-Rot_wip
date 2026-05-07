"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchVaultTool = searchVaultTool;
const obsidian_service_1 = require("../services/obsidian.service");
async function searchVaultTool(args) {
    try {
        const results = await obsidian_service_1.obsidianService.searchVault(args.query, args.limit ?? 5);
        if (!results.length)
            return "No results found for that query.";
        return results
            .map((r) => `**${r.path}** (score: ${r.score.toFixed(2)})\n${r.content}`)
            .join("\n---\n");
    }
    catch {
        return `Error: vault search failed for query "${args.query}"`;
    }
}
