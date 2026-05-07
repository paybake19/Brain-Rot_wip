"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ollama_service_1 = require("../services/ollama.service");
const context_service_1 = require("../services/context.service");
const loader_1 = require("../llm/loader");
const parser_1 = require("../llm/parser");
const executor_service_1 = require("../services/executor.service");
const tool_prompt_1 = require("../llm/prompts/tool.prompt");
const stream_1 = require("../llm/stream");
const validate_1 = require("../utils/validate");
const logger_service_1 = require("../services/logger.service");
const router = (0, express_1.Router)();
router.post("/stream", async (req, res) => {
    const parsed = validate_1.ChatRequestSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: "Invalid request", details: parsed.error.issues });
        return;
    }
    const { messages, imageBase64 } = parsed.data;
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
    (0, stream_1.setSSEHeaders)(res);
    try {
        // 1. Load vault context from vector store
        const vaultSnippets = lastUserMessage
            ? await (0, loader_1.loadContext)(lastUserMessage.content)
            : [];
        // 2. Build system prompt with memory + vault context
        const systemPrompt = await context_service_1.contextService.buildSystemPrompt(vaultSnippets);
        const toolPrompt = (0, tool_prompt_1.buildToolPrompt)();
        // 3. Assemble message array for Ollama
        const ollamaMessages = [
            { role: "system", content: `${systemPrompt}\n\n${toolPrompt}` },
            ...messages.map((m) => ({
                role: m.role,
                content: m.content,
                ...(imageBase64 && m.role === "user" ? { images: [imageBase64] } : {}),
            })),
        ];
        // 4. Stream from Ollama
        let fullResponse = "";
        for await (const chunk of ollama_service_1.ollamaService.streamChat(ollamaMessages)) {
            if (chunk.type === "token") {
                fullResponse += chunk.content;
                (0, stream_1.writeSSEChunk)(res, chunk);
            }
            else if (chunk.type === "error") {
                (0, stream_1.writeSSEChunk)(res, chunk);
                res.end();
                return;
            }
            else if (chunk.type === "done") {
                // 5. Check for tool calls in the full response
                const toolCalls = (0, parser_1.parseToolCalls)(fullResponse);
                if (toolCalls.length > 0) {
                    for (const call of toolCalls) {
                        (0, stream_1.writeSSEChunk)(res, {
                            type: "tool_call",
                            content: JSON.stringify({ name: call.name, args: call.arguments }),
                        });
                        const result = await executor_service_1.executorService.execute(call);
                        (0, stream_1.writeSSEChunk)(res, {
                            type: "token",
                            content: `\n\n**[${call.name}]:** ${result.result}`,
                        });
                    }
                }
                (0, stream_1.writeSSEChunk)(res, { type: "done", content: "" });
                res.end();
                return;
            }
        }
    }
    catch (err) {
        logger_service_1.logger.error("Chat stream error", { error: err.message });
        (0, stream_1.writeSSEChunk)(res, { type: "error", content: err.message });
        res.end();
    }
});
exports.default = router;
