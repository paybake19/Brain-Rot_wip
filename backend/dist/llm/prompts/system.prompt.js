"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSystemPrompt = buildSystemPrompt;
const obsidian_service_1 = require("../../services/obsidian.service");
async function buildSystemPrompt(vaultSnippets = []) {
    const groundRules = await obsidian_service_1.obsidianService.readNote("03-System/Ground-Rules.md");
    const aiMemory = await obsidian_service_1.obsidianService.readNote("00-Core/AI-Memory.md");
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
