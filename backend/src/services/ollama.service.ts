import { config } from "../config";
import { logger } from "./logger.service";

export interface OllamaMessage {
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  images?: string[];
}

export interface StreamChunk {
  type: "token" | "tool_call" | "done" | "error";
  content: string;
}

export class OllamaService {
  private baseUrl = config.ollama.baseUrl;
  private model = config.ollama.model;

  async *streamChat(
    messages: OllamaMessage[]
  ): AsyncGenerator<StreamChunk> {
    try {
      const res = await fetch(`${this.baseUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: this.model,
          messages,
          stream: true,
        }),
      });

      if (!res.ok || !res.body) {
        yield { type: "error", content: `Ollama error: ${res.status}` };
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
          if (!line.trim()) continue;
          try {
            const json = JSON.parse(line);
            const token = json?.message?.content ?? "";
            if (token) yield { type: "token", content: token };
            if (json?.done) yield { type: "done", content: "" };
          } catch {
            // malformed line — skip
          }
        }
      }

      yield { type: "done", content: "" };
    } catch (err: any) {
      logger.error("OllamaService.streamChat error", { error: err.message });
      yield { type: "error", content: err.message };
    }
  }

  async generate(prompt: string, imageBase64?: string): Promise<string> {
    const body: any = {
      model: this.model,
      prompt,
      stream: false,
    };
    if (imageBase64) body.images = [imageBase64];

    const res = await fetch(`${this.baseUrl}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return data?.response ?? "";
  }

  async embed(text: string): Promise<number[]> {
    const res = await fetch(`${this.baseUrl}/api/embeddings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: config.ollama.embedModel,
        prompt: text,
      }),
    });
    const data = await res.json();
    return data?.embedding ?? [];
  }
}

export const ollamaService = new OllamaService();
