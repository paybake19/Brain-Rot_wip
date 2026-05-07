import { Browser, Page, chromium } from "playwright";

let browserInstance: Browser | null = null;
let pageInstance: Page | null = null;

export async function getBrowser(): Promise<Browser> {
  if (!browserInstance || !browserInstance.isConnected()) {
    browserInstance = await chromium.launch({ headless: true });
  }
  return browserInstance;
}

export async function getPage(): Promise<Page> {
  if (!pageInstance || pageInstance.isClosed()) {
    const browser = await getBrowser();
    pageInstance = await browser.newPage();
  }
  return pageInstance;
}

export async function closeBrowser(): Promise<void> {
  await browserInstance?.close();
  browserInstance = null;
  pageInstance = null;
}
