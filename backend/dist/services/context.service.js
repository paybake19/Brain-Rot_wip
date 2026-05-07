"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contextService = exports.ContextService = void 0;
const obsidian_service_1 = require("./obsidian.service");
const logger_service_1 = require("./logger.service");
class ContextService {
    async buildSystemPrompt(vaultSnippets = []) {
        let groundRules = "";
        let aiMemory = "";
        try {
            const gr = await obsidian_service_1.obsidianService.readNote("03-System/Ground-Rules.md");
            groundRules = gr.content;
        }
        catch {
            logger_service_1.logger.warn("Ground-Rules.md not found in vault");
        }
        try {
            const mem = await obsidian_service_1.obsidianService.readNote("00-Core/AI-Memory.md");
            aiMemory = mem.content;
        }
        catch {
            logger_service_1.logger.warn("AI-Memory.md not found in vault");
        }
        const snippetBlock = vaultSnippets.length > 0
            ? `[Relevant Vault Context]\n${vaultSnippets
                .slice(0, 5)
                .map((s) => s.slice(0, 500))
                .join("\n---\n")}`
            : "";
        return `You are Brainrot, a precise, proactive, and highly capable local AI system assistant — like Jarvis, but running entirely on the user's machine.
You have full access to the user's knowledge vault, desktop, browser, and system tools.
You are formal but efficient. You never hallucinate tool calls. You think before acting.
Today is ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}.
Current time: ${new Date().toLocaleTimeString()}.

${groundRules ? `[Operational Ground Rules]\n${groundRules}` : ""}

${aiMemory ? `[Persistent Memory]\n${aiMemory}` : ""}

${snippetBlock}`.trim();
    }
}
exports.ContextService = ContextService;
exports.contextService = new ContextService();
