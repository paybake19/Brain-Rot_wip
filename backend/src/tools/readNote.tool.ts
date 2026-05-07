import { obsidianService } from "../services/obsidian.service";
import { logger } from "../services/logger.service";

export async function readNoteTool(args: { path: string }): Promise<string> {
  try {
    const note = await obsidianService.readNote(args.path);
    return note.content;
  } catch (err: any) {
    logger.error("readNoteTool failed", { path: args.path, error: err.message });
    return `Error: could not read note at path "${args.path}" — ${err.message}`;
  }
}
