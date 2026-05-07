"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.desktopAgent = exports.DesktopAgent = void 0;
const ollama_service_1 = require("../services/ollama.service");
const desktop_service_1 = require("../services/desktop.service");
const runShell_tool_1 = require("../tools/runShell.tool");
const allowlist_middleware_1 = require("../middleware/allowlist.middleware");
const logger_service_1 = require("../services/logger.service");
class DesktopAgent {
    async run(instruction) {
        logger_service_1.logger.info("DesktopAgent started", { instruction });
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
        const raw = await ollama_service_1.ollamaService.generate(intentPrompt);
        let parsed;
        try {
            const clean = raw.replace(/```json|```/g, "").trim();
            parsed = JSON.parse(clean);
        }
        catch (err) {
            logger_service_1.logger.error("DesktopAgent failed to parse LLM intent", { raw });
            return `Error: could not parse intent from instruction "${instruction}"`;
        }
        switch (parsed.action) {
            case "shell": {
                if (!parsed.command)
                    return "Error: no command provided for shell action.";
                if (!(0, allowlist_middleware_1.isCommandAllowed)(parsed.command)) {
                    return `Error: command "${parsed.command}" is not on the allowlist.`;
                }
                return (0, runShell_tool_1.runShellTool)({ command: parsed.command });
            }
            case "clipboard_read": {
                const content = await desktop_service_1.desktopService.getClipboard();
                return `Clipboard contents:\n${content}`;
            }
            case "clipboard_write": {
                if (!parsed.text)
                    return "Error: no text provided for clipboard write.";
                await desktop_service_1.desktopService.setClipboard(parsed.text);
                return `Clipboard updated with: "${parsed.text}"`;
            }
            case "notify": {
                if (!parsed.text)
                    return "Error: no message provided for notification.";
                desktop_service_1.desktopService.notify(parsed.title ?? "Brainrot", parsed.text);
                return `Notification sent: "${parsed.text}"`;
            }
            default:
                return `Unknown desktop action for instruction: "${instruction}"`;
        }
    }
}
exports.DesktopAgent = DesktopAgent;
exports.desktopAgent = new DesktopAgent();
