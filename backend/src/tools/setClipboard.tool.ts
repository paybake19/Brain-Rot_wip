import { desktopService } from "../services/desktop.service";

export async function setClipboardTool(args: { text: string }): Promise<string> {
  try {
    await desktopService.setClipboard(args.text);
    return "Clipboard updated successfully.";
  } catch {
    return "Error: could not write to clipboard.";
  }
}
