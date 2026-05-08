const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3001";
const API_KEY = import.meta.env.VITE_API_KEY ?? "";

export interface ApiMessage {
  id: string;
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  timestamp: number;
}

export interface StreamChunk {
  type: "token" | "tool_call" | "done" | "error";
  content: string;
}

export async function streamChat(
  messages: ApiMessage[],
  sessionId: string,
  imageBase64?: string,
  signal?: AbortSignal
): Promise<AsyncGenerator<StreamChunk>> {
  const payload = {
    sessionId,
    messages,
    imageBase64,
  };

  console.log("Sending payload:", payload);

  const res = await fetch(`${BASE}/api/chat/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(payload),
    signal,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }

  if (!res.body) {
    throw new Error("No response body from server");
  }

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

      const events = buffer.split("\n\n");
      buffer = events.pop() ?? "";

      for (const event of events) {
        const lines = event.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;

          const raw = line.slice(6).trim();

          if (!raw || raw === "[DONE]") continue;

          try {
            const chunk = JSON.parse(raw) as StreamChunk;

            yield chunk;

            if (chunk.type === "done" || chunk.type === "error") {
              return;
            }
          } catch (err) {
            console.error("Malformed SSE chunk:", raw);
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
