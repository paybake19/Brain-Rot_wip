import { Response } from "express";
import { StreamChunk } from "../services/ollama.service";

export function setSSEHeaders(res: Response): void {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();
}

export function writeSSEChunk(res: Response, chunk: StreamChunk): void {
  res.write(`data: ${JSON.stringify(chunk)}\n\n`);
}

export async function pipeStreamToSSE(
  stream: AsyncGenerator<StreamChunk>,
  res: Response,
  onToolCall?: (content: string) => Promise<string>
): Promise<void> {
  setSSEHeaders(res);

  for await (const chunk of stream) {
    if (chunk.type === "token") {
      writeSSEChunk(res, chunk);
    } else if (chunk.type === "tool_call" && onToolCall) {
      const result = await onToolCall(chunk.content);
      writeSSEChunk(res, { type: "tool_call", content: result });
    } else if (chunk.type === "done") {
      writeSSEChunk(res, { type: "done", content: "" });
      res.end();
      return;
    } else if (chunk.type === "error") {
      writeSSEChunk(res, chunk);
      res.end();
      return;
    }
  }

  res.end();
}
