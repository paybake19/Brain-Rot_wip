import { paths } from "../config/paths";
import { logger } from "../services/logger.service";
import { NoteChunk } from "./chunker";

let db: any = null;
let table: any = null;

export async function initVectorStore(): Promise<void> {
  const lancedb = await import("@lancedb/lancedb");
  db = await lancedb.connect(paths.lancedb);

  const tableNames: string[] = await db.tableNames();
  if (tableNames.includes("vault_chunks")) {
    table = await db.openTable("vault_chunks");
  } else {
    table = await db.createTable("vault_chunks", [
      {
        path: "__init__",
        chunkIndex: 0,
        content: "",
        hash: "",
        vector: Array(768).fill(0),
      },
    ]);
  }

  logger.info("Vector store ready", { path: paths.lancedb });
}

export async function upsertChunks(
  chunks: NoteChunk[],
  vectors: number[][]
): Promise<void> {
  if (!table) throw new Error("Vector store not initialized");

  const rows = chunks.map((chunk, i) => ({
    path: chunk.path,
    chunkIndex: chunk.chunkIndex,
    content: chunk.content,
    hash: chunk.hash,
    vector: vectors[i],
  }));

  await table.add(rows);
}

export async function deleteNote(notePath: string): Promise<void> {
  if (!table) return;
  await table.delete(`path = '${notePath.replace(/'/g, "''")}'`);
}

export function getTable() {
  return table;
}
