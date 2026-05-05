import { Router, Request, Response } from "express";
import { ollamaService, OllamaMessage } from "../services/ollama.service";
import { contextService } from "../services/context.service";
import { loadContext } from "../llm/loader";
import { parseToolCalls } from "../llm/parser";
import { executorService } from "../services/executor.service";
import { buildToolPrompt } from "../llm/prompts/tool.prompt";
import { setSSEHeaders, writeSSEChunk } from "../llm/stream";
import { ChatRequestSchema } from "../utils/validate";
import { logger } from "../services/logger.service";

const router = Router();

router.post("/stream", async (req: Request, res: Response) => {
  const parsed = ChatRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request", details: parsed.error.issues });
    return;
  }

  const { messages, imageBase64 } = parsed.data;
  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");

  setSSEHeaders(res);

  try {
    // 1. Load vault context from vector store
    const vaultSnippets = lastUserMessage
      ? await loadContext(lastUserMessage.content)
      : [];

    // 2. Build system prompt with memory + vault context
    const systemPrompt = await contextService.buildSystemPrompt(vaultSnippets);
    const toolPrompt = buildToolPrompt();

    // 3. Assemble message array for Ollama
    const ollamaMessages: OllamaMessage[] = [
      { role: "system", content: `${systemPrompt}\n\n${toolPrompt}` },
      ...messages.map((m) => ({
        role: m.role as OllamaMessage["role"],
        content: m.content,
        ...(imageBase64 && m.role === "user" ? { images: [imageBase64] } : {}),
      })),
    ];

    // 4. Stream from Ollama
    let fullResponse = "";

    for await (const chunk of ollamaService.streamChat(ollamaMessages)) {
      if (chunk.type === "token") {
        fullResponse += chunk.content;
        writeSSEChunk(res, chunk);
      } else if (chunk.type === "error") {
        writeSSEChunk(res, chunk);
        res.end();
        return;
      } else if (chunk.type === "done") {
        // 5. Check for tool calls in the full response
        const toolCalls = parseToolCalls(fullResponse);

        if (toolCalls.length > 0) {
          for (const call of toolCalls) {
            writeSSEChunk(res, {
              type: "tool_call",
              content: JSON.stringify({ name: call.name, args: call.arguments }),
            });

            const result = await executorService.execute(call);

            writeSSEChunk(res, {
              type: "token",
              content: `\n\n**[${call.name}]:** ${result.result}`,
            });
          }
        }

        writeSSEChunk(res, { type: "done", content: "" });
        res.end();
        return;
      }
    }
  } catch (err: any) {
    logger.error("Chat stream error", { error: err.message });
    writeSSEChunk(res, { type: "error", content: err.message });
    res.end();
  }
});

export default router;
