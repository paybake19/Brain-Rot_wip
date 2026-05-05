import { getTable } from "./store";
import { NoteChunk } from "./chunker";
import { logger } from "../services/logger.service";

export async function semanticSearch(
  queryVector: number[],
  topK = 5
): Promise<NoteChunk[]> {
  const table = getTable();
  if (!table) {
    logger.warn("Vector search called before store initialized");
    return [];
  }

  try {
    const results = await table.search(queryVector).limit(topK).execute();
    return results.map((r: any) => ({
      path: r.path,
      chunkIndex: r.chunkIndex,
      content: r.content,
      hash: r.hash,
    }));
  } catch (err: any) {
    logger.error("semanticSearch failed", { error: err.message });
    return [];
  }
}
