import { logger } from "../services/logger.service";
import crypto from "crypto";

export interface ParsedToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
}

export function parseToolCalls(rawOutput: string): ParsedToolCall[] {
  const regex = /<tool_call>([\s\S]*?)<\/tool_call>/g;
  const calls: ParsedToolCall[] = [];
  let match;

  while ((match = regex.exec(rawOutput)) !== null) {
    try {
      const parsed = JSON.parse(match[1].trim());
      calls.push({
        id: crypto.randomUUID(),
        name: parsed.name,
        arguments: parsed.arguments ?? {},
      });
    } catch (err: any) {
      logger.warn("Failed to parse tool call JSON", { raw: match[1], error: err.message });
    }
  }

  return calls;
}
