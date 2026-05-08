import { ollamaService } from "../services/ollama.service";
import { logger } from "../services/logger.service";

export async function describeImage(image: Buffer): Promise<string> {
  try {
    const base64 = image.toString("base64");
    const description = await ollamaService.generate(
      "Describe what you see in this image in detail.",
      base64
    );
    return description;
  } catch (err: any) {
    logger.error("describeImage failed", { error: err.message });
    throw err;
  }
}
