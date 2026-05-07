import clipboardy from "clipboardy";
//import notifier from "node-notifier";
import { logger } from "./logger.service";

export class DesktopService {
  async getClipboard(): Promise<string> {
    return clipboardy.read();
  }

  async setClipboard(text: string): Promise<void> {
    await clipboardy.write(text);
  }

//  notify(title: string, body: string): void {
//    notifier.notify({ title, message: body });
//    logger.info("Desktop notification sent", { title });
//  }
}

export const desktopService = new DesktopService();
