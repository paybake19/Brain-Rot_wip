import https from "https";
import { config } from "../config";
import { logger } from "./logger.service";

const agent = new https.Agent({ rejectUnauthorized: false });

const BASE = `${config.obsidian.host}:${config.obsidian.port}`;
const HEADERS = {
  Authorization: `Bearer ${config.obsidian.apiKey}`,
  "Content-Type": "application/json",
};

async function obsidianFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
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

export class ObsidianService {
  async readNote(notePath: string): Promise<{ path: string; content: string; tags: string[] }> {
    try {
      const data = await obsidianFetch(`/vault/${encodeURIComponent(notePath)}`);
      return {
        path: notePath,
        content: data?.content ?? "",
        tags: data?.frontmatter?.tags ?? [],
      };
    } catch (err: any) {
      logger.error("ObsidianService.readNote failed", { notePath, error: err.message });
      throw err;
    }
  }

  async writeNote(notePath: string, content: string): Promise<void> {
    await obsidianFetch(`/vault/${encodeURIComponent(notePath)}`, {
      method: "PUT",
      body: JSON.stringify({ content }),
    });
  }

  async appendNote(notePath: string, content: string): Promise<void> {
    await obsidianFetch(`/vault/${encodeURIComponent(notePath)}`, {
      method: "POST",
      body: JSON.stringify({ content }),
    });
  }

  async searchVault(query: string, limit = 10): Promise<Array<{ path: string; score: number; content: string }>> {
    try {
      const data = await obsidianFetch(
        `/search/simple/?query=${encodeURIComponent(query)}&contextLength=200`
      );
      return (data ?? []).slice(0, limit).map((r: any) => ({
        path: r.filename ?? "",
        score: r.score ?? 0,
        content: r.context ?? "",
      }));
    } catch (err: any) {
      logger.error("ObsidianService.searchVault failed", { query, error: err.message });
      return [];
    }
  }

  async listNotes(folder = ""): Promise<string[]> {
    try {
      const data = await obsidianFetch(`/vault/${folder}`);
      return (data?.files ?? []).filter((f: string) => f.endsWith(".md"));
    } catch (err: any) {
      logger.error("ObsidianService.listNotes failed", { folder, error: err.message });
      return [];
    }
  }
}

export const obsidianService = new ObsidianService();
