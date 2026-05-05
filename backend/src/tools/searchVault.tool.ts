import { obsidianService } from "../services/obsidian.service";

export async function searchVaultTool(args: { query: string; limit?: number }): Promise<string> {
  try {
    const results = await obsidianService.searchVault(args.query, args.limit ?? 5);
    if (!results.length) return "No results found for that query.";
    return results
      .map((r) => `**${r.path}** (score: ${r.score.toFixed(2)})\n${r.content}`)
      .join("\n---\n");
  } catch {
    return `Error: vault search failed for query "${args.query}"`;
  }
}
