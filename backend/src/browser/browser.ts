import { Browser, Page, chromium } from "playwright";
import { logger } from "../services/logger.service";

let browserInstance: Browser | null = null;
let pageInstance: Page | null = null;

export async function getBrowser(): Promise<Browser> {
  if (!browserInstance || !browserInstance.isConnected()) {
    browserInstance = await chromium.launch({ headless: true });
    logger.info("Playwright browser launched");
  }
  return browserInstance;
}

export async function getPage(): Promise<Page> {
  const browser = await getBrowser();
  if (!pageInstance || pageInstance.isClosed()) {
    pageInstance = await browser.newPage();
  }
  return pageInstance;
}

export async function closeBrowser(): Promise<void> {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
    pageInstance = null;
  }
}
