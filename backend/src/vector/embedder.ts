import { ollamaService } from "../services/ollama.service";
import { logger } from "../services/logger.service";

export async function embed(text: string): Promise<number[]> {
  try {
    return await ollamaService.embed(text);
  } catch (err: any) {
    logger.error("embed failed", { error: err.message });
    throw err;
  }
}
