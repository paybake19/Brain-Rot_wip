import { obsidianService } from "./obsidian.service";
import { logger } from "./logger.service";

export class ContextService {
  async buildSystemPrompt(vaultSnippets: string[] = []): Promise<string> {
    let groundRules = "";
    let aiMemory = "";

    try {
      const gr = await obsidianService.readNote("03-System/Ground-Rules.md");
      groundRules = gr.content;
    } catch {
      logger.warn("Ground-Rules.md not found in vault");
    }

    try {
      const mem = await obsidianService.readNote("00-Core/AI-Memory.md");
      aiMemory = mem.content;
    } catch {
      logger.warn("AI-Memory.md not found in vault");
    }

    const snippetBlock =
      vaultSnippets.length > 0
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

export const contextService = new ContextService();
