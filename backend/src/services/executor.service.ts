import { ParsedToolCall } from "../llm/parser";
import { readNoteTool } from "../tools/readNote.tool";
import { writeNoteTool } from "../tools/writeNote.tool";
import { appendNoteTool } from "../tools/appendNote.tool";
import { searchVaultTool } from "../tools/searchVault.tool";
import { semanticSearchTool } from "../tools/semanticSearch.tool";
import { screenshotTool } from "../tools/screenshot.tool";
import { browserNavigateTool } from "../tools/browserNavigate.tool";
import { browserScrapeTool } from "../tools/browserScrape.tool";
import { getClipboardTool } from "../tools/getClipboard.tool";
import { setClipboardTool } from "../tools/setClipboard.tool";
import { runShellTool } from "../tools/runShell.tool";
import { bus } from "../events/bus";
import { logger } from "./logger.service";

export interface ToolResult {
  toolCallId: string;
  result: string;
  isError: boolean;
}

export class ExecutorService {
  async execute(call: ParsedToolCall): Promise<ToolResult> {
    bus.emit("tool:called", { name: call.name, args: call.arguments });
    logger.info("Executing tool", { name: call.name });

    let result = "";
    let isError = false;

    try {
      switch (call.name) {
        case "read_note":
          result = await readNoteTool(call.arguments as any);
          break;
        case "write_note":
          result = await writeNoteTool(call.arguments as any);
          break;
        case "append_note":
          result = await appendNoteTool(call.arguments as any);
          break;
        case "search_vault":
          result = await searchVaultTool(call.arguments as any);
          break;
        case "semantic_search":
          result = await semanticSearchTool(call.arguments as any);
          break;
        case "screenshot":
          result = await screenshotTool();
          break;
        case "browser_navigate":
          result = await browserNavigateTool(call.arguments as any);
          break;
        case "browser_scrape":
          result = await browserScrapeTool();
          break;
        case "get_clipboard":
          result = await getClipboardTool();
          break;
        case "set_clipboard":
          result = await setClipboardTool(call.arguments as any);
          break;
        case "run_shell":
          result = await runShellTool(call.arguments as any);
          break;
        default:
          result = `Unknown tool: "${call.name}"`;
          isError = true;
      }
    } catch (err: any) {
      result = `Tool execution error: ${err.message}`;
      isError = true;
    }

    bus.emit("tool:result", { name: call.name, result, isError });
    return { toolCallId: call.id, result, isError };
  }
}

export const executorService = new ExecutorService();
