import screenshot from "screenshot-desktop";
import { logger } from "../services/logger.service";

export async function captureScreen(): Promise<Buffer> {
  try {
    const buffer = await screenshot({ format: "png" });
    return buffer;
  } catch (err: any) {
    logger.error("captureScreen failed", { error: err.message });
    throw err;
  }
}
