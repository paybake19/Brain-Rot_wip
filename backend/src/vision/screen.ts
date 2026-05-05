import screenshot from "screenshot-desktop";
import { logger } from "../services/logger.service";

export async function captureScreen(): Promise<Buffer> {
  try {
    const img = await screenshot({ format: "png" });
    return img;
  } catch (err: any) {
    logger.error("captureScreen failed", { error: err.message });
    throw err;
  }
}
