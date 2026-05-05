import { captureScreen } from "../vision/screen";
import { describeImage } from "../vision/describe";

export async function screenshotTool(): Promise<string> {
  try {
    const buffer = await captureScreen();
    const description = await describeImage(buffer);
    return description;
  } catch {
    return "Error: could not capture or describe the screen.";
  }
}
