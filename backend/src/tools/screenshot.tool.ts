import { captureScreen } from "../vision/screen";
import { describeImage } from "../vision/describe";
import { logger } from "../services/logger.service";

export async function screenshotTool(): Promise<string> {
  try {
    const buffer = await captureScreen();
    const description = await describeImage(buffer);
    return description;
  } catch (err: any) {
    logger.error("screenshotTool failed", { error: err.message });
    return "Error: could not capture or describe the screen.";
  }
}
