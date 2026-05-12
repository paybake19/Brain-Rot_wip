/**
 * vault.api.ts — client for the Obsidian vault REST endpoints.
 * Mirrors the auth and error-handling patterns of chat.api.ts.
 */

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'
const API_KEY = import.meta.env.VITE_API_KEY ?? ''

const authHeaders = (): HeadersInit =>
  API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {}

async function vaultFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { ...authHeaders(), ...(init?.headers ?? {}) },
  })

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw new Error(`Vault API error ${res.status}: ${text}`)
  }

  return res.json() as Promise<T>
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface VaultNote {
  path: string
  content: string
  tags: string[]
}

export interface VaultSearchResult {
  path: string
  score: number
  content: string
}

/**
 * Fetch the full content of a single note by its vault-relative path.
 */
export async function readNote(notePath: string): Promise<VaultNote> {
  return vaultFetch<VaultNote>(
    `${BASE}/api/vault/note?path=${encodeURIComponent(notePath)}`
  )
}

/**
 * List all markdown notes in a given folder (defaults to vault root).
 */
export async function listNotes(folder = ''): Promise<string[]> {
  const data = await vaultFetch<{ files: string[] }>(
    `${BASE}/api/vault/list?folder=${encodeURIComponent(folder)}`
  )
  return data.files
}

/**
 * Full-text search across the vault.
 */
export async function searchVault(
  query: string
): Promise<VaultSearchResult[]> {
  if (!query.trim()) return []
  const data = await vaultFetch<{ results: VaultSearchResult[] }>(
    `${BASE}/api/vault/search?q=${encodeURIComponent(query)}`
  )
  return data.results
}
