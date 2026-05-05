import { embed } from "../vector/embedder";
import { semanticSearch } from "../vector/search";
import { logger } from "../services/logger.service";

export async function loadContext(userQuery: string): Promise<string[]> {
  try {
    const queryVector = await embed(userQuery);
    const chunks = await semanticSearch(queryVector, 5);
    return chunks.map((c) => `### ${c.path}\n${c.content.slice(0, 500)}`);
  } catch (err: any) {
    logger.warn("loadContext failed — returning empty context", { error: err.message });
    return [];
  }
}
