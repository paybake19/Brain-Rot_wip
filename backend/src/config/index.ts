import dotenv from "dotenv";
import path from "path";

const currentDir = __dirname;
const rootDir = path.resolve(currentDir, "../../..");

// 3. Combine root with the .env filename
const envPath = path.join(rootDir, ".env");

const result = dotenv.config({ path: envPath });


function require_env(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required environment variable: ${key}`);
  return val;
}

export const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || "development",
  apiKey: require_env("BRAINROT_API_KEY"),
  deepseek: {
    apiKey: require_env("DEEPSEEK_API_KEY"),
    model: process.env.DEEPSEEK_MODEL || "deepseek-chat",
    baseUrl: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com",
  },
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  ollama: {
    baseUrl: require_env("OLLAMA_BASE_URL"),
    model: require_env("OLLAMA_MODEL_DEFAULT"),
    embedModel: process.env.OLLAMA_EMBED_MODEL || "nomic-embed-text",
  },
  obsidian: {
    host: require_env("OBSIDIAN_HOST"),
    port: parseInt(process.env.OBSIDIAN_PORT || "27124"),
    apiKey: require_env("OBSIDIAN_API_KEY"),
  },
  vault: {
    path: process.env.VAULT_PATH || "",
  },
  whisper: {
    binPath: process.env.WHISPER_BIN_PATH || "",
  },
  lancedb: {
    path: process.env.LANCEDB_PATH || path.join(__dirname, "../../.lancedb"),
  },
};
