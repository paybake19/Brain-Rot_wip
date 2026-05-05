import fs from "fs/promises";
import path from "path";
import { logger } from "../services/logger.service";

export async function safeRead(filePath: string): Promise<string | null> {
  try {
    return await fs.readFile(filePath, "utf-8");
  } catch (err: any) {
    if (err.code === "ENOENT") return null;
    logger.error("safeRead failed", { filePath, error: err.message });
    throw err;
  }
}

export async function safeWrite(filePath: string, content: string): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content, "utf-8");
}

export async function exists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
