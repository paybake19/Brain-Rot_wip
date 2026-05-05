import { contextService } from "../../services/context.service";

export async function buildSystemPrompt(vaultSnippets: string[] = []): Promise<string> {
  return contextService.buildSystemPrompt(vaultSnippets);
}
  // SUDO: obsidianService.readNote('03-System/Ground-Rules.md')
  // SUDO: obsidianService.readNote('00-Core/AI-Memory.md')
  // SUDO: return assembled string:
  //   "You are Brainrot, a precise and proactive AI system assistant.
  //    You are running locally. Treat the user as your operator.
  //    Today is ${new Date().toLocaleDateString()}.
  //    [Ground Rules]
  //    ${groundRules.content}
  //    [Persistent Memory]
  //    ${aiMemory.content}"
}
