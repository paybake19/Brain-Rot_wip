import { obsidianService } from "../services/obsidian.service";

export async function writeNoteTool(args: { path: string; content: string }): Promise<string> {
  try {
    await obsidianService.writeNote(args.path, args.content);
    return `Note written successfully to "${args.path}"`;
  } catch {
    return `Error: could not write note at path "${args.path}"`;
  }
}
