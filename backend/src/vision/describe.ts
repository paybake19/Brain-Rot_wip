import { ollamaService } from "../services/ollama.service";
import { buildVisionPrompt } from "../llm/prompts/vision.prompt";

export async function describeImage(imageBuffer: Buffer): Promise<string> {
  const base64 = imageBuffer.toString("base64");
  return ollamaService.generate(buildVisionPrompt(), base64);
}
