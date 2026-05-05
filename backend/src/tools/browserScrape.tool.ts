import { scrapePage } from "../browser/scraper";

export async function browserScrapeTool(): Promise<string> {
  try {
    const { text, links } = await scrapePage();
    return `[Page Text]\n${text}\n\n[Links]\n${links.slice(0, 20).join("\n")}`;
  } catch {
    return "Error: failed to scrape current page.";
  }
}
