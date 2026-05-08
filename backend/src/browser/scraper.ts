// Canonical file — rename src/browser/scrapper.ts → src/browser/scraper.ts
// (removes double-p typo that breaks all 4 import sites)
import { getPage } from "./browser";

export async function scrapePage(): Promise<{ text: string; links: string[] }> {
  const page = await getPage();

  const text: string = await page.evaluate(
    () => document.body?.innerText ?? ""
  );
  const links: string[] = await page.evaluate(() =>
    Array.from(document.querySelectorAll("a[href]"))
      .map((a) => (a as HTMLAnchorElement).href)
      .filter((h) => h.startsWith("http"))
  );

  return {
    text: text.slice(0, 5000),
    links: links.slice(0, 50),
  };
}
