"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.obsidianService = exports.ObsidianService = void 0;
const https_1 = __importDefault(require("https"));
const config_1 = require("../config");
const logger_service_1 = require("./logger.service");
const agent = new https_1.default.Agent({ rejectUnauthorized: false });
const BASE = `${config_1.config.obsidian.host}:${config_1.config.obsidian.port}`;
const HEADERS = {
    Authorization: `Bearer ${config_1.config.obsidian.apiKey}`,
    "Content-Type": "application/json",
};
async function obsidianFetch(endpoint, options = {}) {
    const res = await fetch(`${BASE}${endpoint}`, {
        ...options,
        headers: { ...HEADERS, ...(options.headers || {}) },
        // @ts-ignore — node fetch agent
        agent,
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Obsidian API error ${res.status}: ${text}`);
    }
    return res.json().catch(() => null);
}
class ObsidianService {
    async readNote(notePath) {
        try {
            const data = await obsidianFetch(`/vault/${encodeURIComponent(notePath)}`);
            return {
                path: notePath,
                content: data?.content ?? "",
                tags: data?.frontmatter?.tags ?? [],
            };
        }
        catch (err) {
            logger_service_1.logger.error("ObsidianService.readNote failed", { notePath, error: err.message });
            throw err;
        }
    }
    async writeNote(notePath, content) {
        await obsidianFetch(`/vault/${encodeURIComponent(notePath)}`, {
            method: "PUT",
            body: JSON.stringify({ content }),
        });
    }
    async appendNote(notePath, content) {
        await obsidianFetch(`/vault/${encodeURIComponent(notePath)}`, {
            method: "POST",
            body: JSON.stringify({ content }),
        });
    }
    async searchVault(query, limit = 10) {
        try {
            const data = await obsidianFetch(`/search/simple/?query=${encodeURIComponent(query)}&contextLength=200`);
            return (data ?? []).slice(0, limit).map((r) => ({
                path: r.filename ?? "",
                score: r.score ?? 0,
                content: r.context ?? "",
            }));
        }
        catch (err) {
            logger_service_1.logger.error("ObsidianService.searchVault failed", { query, error: err.message });
            return [];
        }
    }
    async listNotes(folder = "") {
        try {
            const data = await obsidianFetch(`/vault/${folder}`);
            return (data?.files ?? []).filter((f) => f.endsWith(".md"));
        }
        catch (err) {
            logger_service_1.logger.error("ObsidianService.listNotes failed", { folder, error: err.message });
            return [];
        }
    }
}
exports.ObsidianService = ObsidianService;
exports.obsidianService = new ObsidianService();
