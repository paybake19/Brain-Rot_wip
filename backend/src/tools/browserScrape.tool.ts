import { scrapePage } from "../browser/scraper";
import { logger } from "../services/logger.service";

export async function browserScrapeTool(): Promise<string> {
  try {
    const { text, links } = await scrapePage();
    return `[Page Text]\n${text}\n\n[Links]\n${links.slice(0, 20).join("\n")}`;
  } catch (err: any) {
    logger.error("browserScrapeTool failed", { error: err.message });
    return "Error: failed to scrape current page.";
  }
}
