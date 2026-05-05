import { obsidianService } from "../services/obsidian.service";

export async function appendNoteTool(args: { path: string; content: string }): Promise<string> {
  try {
    await obsidianService.appendNote(args.path, args.content);
    return `Content appended to "${args.path}"`;
  } catch {
    return `Error: could not append to note at path "${args.path}"`;
  }
}
