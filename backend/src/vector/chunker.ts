import { sha256 } from "../utils/hash";

export interface NoteChunk {
  path: string;
  chunkIndex: number;
  content: string;
  hash: string;
}

const TARGET_CHUNK_SIZE = 1600; // ~400 tokens

export function chunkMarkdown(notePath: string, content: string): NoteChunk[] {
  const paragraphs = content.split(/\n\n+/).filter((p) => p.trim());
  const chunks: NoteChunk[] = [];
  let current = "";
  let chunkIndex = 0;
  let prevParagraph = "";

  for (const para of paragraphs) {
    if ((current + para).length > TARGET_CHUNK_SIZE && current) {
      chunks.push({
        path: notePath,
        chunkIndex,
        content: current.trim(),
        hash: sha256(current.trim()),
      });
      current = prevParagraph + "\n\n"; // 1-paragraph overlap
      chunkIndex++;
    }
    current += para + "\n\n";
    prevParagraph = para;
  }

  if (current.trim()) {
    chunks.push({
      path: notePath,
      chunkIndex,
      content: current.trim(),
      hash: sha256(current.trim()),
    });
  }

  return chunks;
}
