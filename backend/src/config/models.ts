export const models = {
  "gemma4:e4b": {
    contextWindow: 8192,
    defaultTemp: 0.3,
    supportsVision: true,
    supportsTools: true,
  },
  "nomic-embed-text": {
    contextWindow: 8192,
    defaultTemp: 0,
    supportsVision: false,
    supportsTools: false,
  },
} as const;

export type ModelName = keyof typeof models;
