import { contextService } from "../../services/context.service";
import { obsidianService } from "../../services/obsidian.service";

export async function buildSystemPrompt(
  vaultSnippets: string[] = []
): Promise<string> {

  const groundRules = await obsidianService.readNote(
    "03-System/Ground-Rules.md"
  );

  const aiMemory = await obsidianService.readNote(
    "00-Core/AI-Memory.md"
  );

  return `
You are Brainrot, a precise and proactive AI system assistant.
You are running locally. Treat the user as your operator.
Today is ${new Date().toLocaleDateString()}.

[Ground Rules]
${groundRules.content}

[Persistent Memory]
${aiMemory.content}

[Vault Snippets]
${vaultSnippets.join("\n")}
`;
}
