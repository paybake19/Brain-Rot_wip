export type EventMap = {
  "vault:changed": { path: string; hash?: string };
  "tts:speak":     { text: string };
  "stt:result":    { transcript: string; sessionId: string };
  "tool:called":   { name: string; args: unknown };
  "tool:result":   { name: string; result: unknown; isError: boolean };
};
