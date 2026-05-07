// EventMap for mitt — index signature is required by mitt's generic constraint.
export type EventMap = {
  [key: string]: unknown;
  "vault:changed": { path: string };
  "tts:speak":     { text: string };
  "stt:result":    { transcript: string; sessionId: string };
};
