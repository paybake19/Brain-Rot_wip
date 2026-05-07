"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), ".env") });
function require_env(key) {
    const val = process.env[key];
    if (!val)
        throw new Error(`Missing required environment variable: ${key}`);
    return val;
}
exports.config = {
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
        path: process.env.LANCEDB_PATH || path_1.default.join(process.cwd(), ".lancedb"),
    },
};
