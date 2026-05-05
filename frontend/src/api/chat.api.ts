// NOTE: We use fetch + ReadableStream, NOT EventSource.
// EventSource only supports GET — our endpoint is POST.

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3001";
const API_KEY = import.meta.env.VITE_API_KEY ?? "";

export interface ApiMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface StreamChunk {
  type: "token" | "tool_call" | "done" | "error";
  content: string;
}

export async function streamChat(
  messages: ApiMessage[],
  imageBase64?: string,
  signal?: AbortSignal
): Promise<AsyncGenerator<StreamChunk>> {
  const res = await fetch(`${BASE}/api/v1/chat/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {}),
    },
    body: JSON.stringify({ messages, imageBase64 }),
    signal,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`Chat API error ${res.status}: ${text}`);
  }

  if (!res.body) throw new Error("No response body from server");

  return parseSSEStream(res.body);
}

async function* parseSSEStream(
  body: ReadableStream<Uint8Array>
): AsyncGenerator<StreamChunk> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        // SSE format: "data: <json>\n"
        if (!line.startsWith("data: ")) continue;
        const raw = line.slice(6).trim();
        if (!raw || raw === "[DONE]") continue;

        try {
          const chunk = JSON.parse(raw) as StreamChunk;
          yield chunk;
          if (chunk.type === "done" || chunk.type === "error") return;
        } catch {
          // malformed line — skip
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
