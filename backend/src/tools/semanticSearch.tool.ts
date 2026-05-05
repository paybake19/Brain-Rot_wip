import { embed } from "../vector/embedder";
import { semanticSearch } from "../vector/search";

export async function semanticSearchTool(args: { query: string }): Promise<string> {
  try {
    const vector = await embed(args.query);
    const results = await semanticSearch(vector, 5);
    if (!results.length) return "No semantically similar notes found.";
    return results
      .map((r) => `**${r.path}**\n${r.content.slice(0, 400)}`)
      .join("\n---\n");
  } catch {
    return `Error: semantic search failed for query "${args.query}"`;
  }
}
