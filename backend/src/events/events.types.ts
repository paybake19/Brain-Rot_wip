export interface EventMap {
  "chat:message": { sessionId: string; content: string };
  "tool:called": { name: string; args: Record<string, unknown> };
  "tool:result": { name: string; result: string; isError: boolean };
  "vault:changed": { path: string; hash: string };
  "vector:reindex": { path: string };
  "tts:speak": { text: string };
  "stt:result": { transcript: string; sessionId: string };
}
