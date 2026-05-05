import { desktopService } from "../services/desktop.service";

export async function getClipboardTool(): Promise<string> {
  try {
    return await desktopService.getClipboard();
  } catch {
    return "Error: could not read clipboard.";
  }
}
