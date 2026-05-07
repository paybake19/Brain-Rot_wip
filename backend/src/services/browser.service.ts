import { Browser, chromium, Page } from 'playwright'

// Singleton browser instance
let browserInstance: Browser | null = null
let pageInstance: Page | null = null

export async function getBrowser(): Promise<Browser> {
  if (!browserInstance || !browserInstance.isConnected()) {
    browserInstance = await chromium.launch({
      headless: true,
    })
  }

  return browserInstance
}

export async function getPage(): Promise<Page> {
  if (!pageInstance || pageInstance.isClosed()) {
    const browser = await getBrowser()
    pageInstance = await browser.newPage()
  }

  return pageInstance
}

export async function closeBrowser(): Promise<void> {
  if (browserInstance) {
    await browserInstance.close()

    browserInstance = null
    pageInstance = null
  }
}

// Core Playwright interaction primitives

export async function navigate(url: string): Promise<void> {
  const page = await getPage()

  await page.goto(url, {
    waitUntil: 'domcontentloaded',
  })
}

export async function clickElement(selector: string): Promise<void> {
  const page = await getPage()

  await page.click(selector)
}

export async function fillInput(
  selector: string,
  value: string
): Promise<void> {
  const page = await getPage()

  await page.fill(selector, value)
}
