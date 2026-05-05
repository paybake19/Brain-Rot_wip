import { sleep } from "../utils/sleep";
import { logger } from "../services/logger.service";

export async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  delayMs = 500
): Promise<T> {
  let lastError: Error = new Error("Unknown error");
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      logger.warn(`Attempt ${attempt}/${maxAttempts} failed`, { error: err.message });
      if (attempt < maxAttempts) await sleep(delayMs * attempt);
    }
  }
  throw lastError;
}
