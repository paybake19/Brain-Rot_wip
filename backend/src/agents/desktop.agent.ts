import { ollamaService } from "../services/ollama.service";
import { desktopService } from "../services/desktop.service";
import { runShellTool } from "../tools/runShell.tool";
import { isCommandAllowed } from "../middleware/allowlist.middleware";
import { logger } from "../services/logger.service";

export class DesktopAgent {
  async run(instruction: string): Promise<string> {
    logger.info("DesktopAgent started", { instruction });

    // 1. Ask the LLM to classify the intent
    const intentPrompt = `You are a desktop automation assistant.
Given this instruction: "${instruction}"
Respond with a single JSON object — no markdown, no explanation:
{
  "action": "shell" | "clipboard_read" | "clipboard_write" | "notify" | "unknown",
  "command": "<shell command if action is shell, else null>",
  "text": "<text if action is clipboard_write or notify, else null>",
  "title": "<notification title if action is notify, else null>"
}`;

    const raw = await ollamaService.generate(intentPrompt);

    let parsed: {
      action: string;
      command: string | null;
      text: string | null;
      title: string | null;
    };

    try {
      const clean = raw.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(clean);
    } catch (err: any) {
      logger.error("DesktopAgent failed to parse LLM intent", { raw });
      return `Error: could not parse intent from instruction "${instruction}"`;
    }

    switch (parsed.action) {
      case "shell": {
        if (!parsed.command) return "Error: no command provided for shell action.";
        if (!isCommandAllowed(parsed.command)) {
          return `Error: command "${parsed.command}" is not on the allowlist.`;
        }
        return runShellTool({ command: parsed.command });
      }

      case "clipboard_read": {
        const content = await desktopService.getClipboard();
        return `Clipboard contents:\n${content}`;
      }

      case "clipboard_write": {
        if (!parsed.text) return "Error: no text provided for clipboard write.";
        await desktopService.setClipboard(parsed.text);
        return `Clipboard updated with: "${parsed.text}"`;
      }

      case "notify": {
        if (!parsed.text) return "Error: no message provided for notification.";
        desktopService.notify(parsed.title ?? "Brainrot", parsed.text);
        return `Notification sent: "${parsed.text}"`;
      }

      default:
        return `Unknown desktop action for instruction: "${instruction}"`;
    }
  }
}

export const desktopAgent = new DesktopAgent();
