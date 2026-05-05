import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

function require_env(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required environment variable: ${key}`);
  return val;
}

export const config = {
  port: process.env.PORT || 3001,
  apiKey: require_env("BRAINROT_API_KEY"),

  ollama: {
    baseUrl: require_env("OLLAMA_BASE_URL"),
    model: require_env("OLLAMA_MODEL_DEFAULT"),
    embedModel: "nomic-embed-text",
  },

  obsidian: {
    host: require_env("OBSIDIAN_HOST"),
    port: parseInt(process.env.OBSIDIAN_PORT || "27124"),
    apiKey: require_env("OBSIDIAN_API_KEY"),
  },

  vault: {
    path: require_env("VAULT_PATH"),
  },

  whisper: {
    binPath: process.env.WHISPER_BIN_PATH || "",
  },

  lancedb: {
    path: process.env.LANCEDB_PATH || path.join(process.cwd(), ".lancedb"),
  },
};
