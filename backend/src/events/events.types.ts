export type EventMap = {
  "vault:changed": { path: string };
  "tts:speak":     { text: string };
  "stt:result":    { transcript: string; sessionId: string };
};
