import { config } from "../config";
import { logger } from "./logger.service";

export interface DeepSeekMessage {
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  images?: string[];
}

export interface StreamChunk {
  type: "token" | "tool_call" | "done" | "error";
  content: string;
}

export class DeepSeekService {
  private baseUrl = config.deepseek.baseUrl;
  private apiKey = config.deepseek.apiKey;
  private model = config.deepseek.model;

  async *streamChat(
    messages: DeepSeekMessage[]
  ): AsyncGenerator<StreamChunk> {
    try {
      const res = await fetch(`${this.baseUrl}/v1/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          stream: true,
        }),
      });

      if (!res.ok || !res.body) {
        const errorBody = await res.text();
        logger.error("DeepSeekService.streamChat HTTP error", {
          status: res.status,
          body: errorBody,
        });
        yield { type: "error", content: `DeepSeek error ${res.status}: ${errorBody}` };
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          // SSE format: "data: {...}" or "data: [DONE]"
          if (!trimmed.startsWith("data: ")) continue;
          const payload = trimmed.slice(6);
          if (payload === "[DONE]") {
            yield { type: "done", content: "" };
            return;
          }

          try {
            const json = JSON.parse(payload);
            const delta = json?.choices?.[0]?.delta;
            if (delta?.content) yield { type: "token", content: delta.content };
            if (json?.choices?.[0]?.finish_reason) yield { type: "done", content: "" };
          } catch {
            // malformed SSE line — skip
          }
        }
      }

      yield { type: "done", content: "" };
    } catch (err: any) {
      logger.error("DeepSeekService.streamChat error", { error: err.message });
      yield { type: "error", content: err.message };
    }
  }

  async generate(prompt: string, imageBase64?: string): Promise<string> {
    const messages: DeepSeekMessage[] = [
      { role: "user", content: prompt },
    ];

    // If an image is provided, include it as a base64 data URL in the message
    if (imageBase64) {
      messages[0].images = [imageBase64];
    }

    const res = await fetch(`${this.baseUrl}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        stream: false,
      }),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      logger.error("DeepSeekService.generate HTTP error", {
        status: res.status,
        body: errorBody,
      });
      throw new Error(`DeepSeek generate error ${res.status}: ${errorBody}`);
    }

    const data = await res.json();
    return data?.choices?.[0]?.message?.content ?? "";
  }

  /** DeepSeek does not support embeddings — caller should fall back to Ollama */
  async embed(_text: string): Promise<number[]> {
    throw new Error("DeepSeek does not support embeddings. Use Ollama as fallback.");
  }
}

export const deepSeekService = new DeepSeekService();
