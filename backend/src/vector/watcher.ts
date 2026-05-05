import fs from "fs";
import { paths } from "../config/paths";
import { bus } from "../events/bus";
import { sha256 } from "../utils/hash";
import { logger } from "../services/logger.service";

const hashCache = new Map<string, string>();

function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): T {
  const timers = new Map<string, ReturnType<typeof setTimeout>>();
  return ((...args: any[]) => {
    const key = args[0];
    const existing = timers.get(key);
    if (existing) clearTimeout(existing);
    timers.set(key, setTimeout(() => fn(...args), delay));
  }) as T;
}

const handleChange = debounce((filePath: string) => {
  if (!filePath.endsWith(".md")) return;
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const hash = sha256(content);
    if (hashCache.get(filePath) === hash) return;
    hashCache.set(filePath, hash);
    bus.emit("vault:changed", { path: filePath, hash });
    logger.info("Vault file changed", { path: filePath });
  } catch (err: any) {
    logger.error("Watcher read error", { filePath, error: err.message });
  }
}, 1500);

export function startVaultWatcher(): void {
  if (!paths.vault) {
    logger.warn("VAULT_PATH not set — watcher disabled");
    return;
  }
  fs.watch(paths.vault, { recursive: true }, (_event, filename) => {
    if (filename) handleChange(`${paths.vault}\\${filename}`);
  });
  logger.info("Vault watcher active", { path: paths.vault });
}
